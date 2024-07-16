import { Request, Response } from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import Redis from "ioredis";
dotenv.config();
const prisma = new PrismaClient();
const redis = new Redis();
const LIVE_SECRET_KEY = "68791341fdd94846a146f0457ff7b455";
export async function makeOrder(req: Request, res: Response) {
  try {
    const { sessionId } = req.body;
    // first check if user id and id from session id are matched
    const value = await redis.get(`checkout-products-${sessionId}`);
    if (value) {
      const products = JSON.parse(value);
      const productsId = products.map(
        (product: { id: number; quantity: number }) => product.id,
      );
      const purchasedProducts = await prisma.product.findMany({
        where: {
          id: {
            in: productsId,
          },
        },
        select: {
          id: true,
          price: true,
          name: true,
        },
      });
      // console.log(purchasedProducts)
      let total = 0;
      const updatedProducts = purchasedProducts.map((product) => {
        const quantity = products.find(
          (p: { id: number; quantity: number }) => p.id === product.id,
        ).quantity;
        total += product.price * quantity;
        return {
          id: product.id,
          price: product.price,
          quantity,
        };
      });
      // fetch products name,quantity and price
      // create an order
      // finally send to the khalti merchant

      const newOrder = await prisma.order.create({
        data: {
          userId: 4,
          total,
          status: "Pending",
        },
      });
      const orderId = newOrder.id;
      console.log(orderId, "orderId");
      for (let { id, quantity, price } of updatedProducts) {
        await prisma.orderItem.create({
          data: {
            orderId,
            productId: id,
            quantity,
            price,
          },
        });
      }
      const paymentResponse = await fetch(
        "https://a.khalti.com/api/v2/epayment/initiate/",
        {
          method: "POST",
          headers: {
            Authorization: `key live_secret_key_68791341fdd94846a146f0457ff7b455`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            return_url: `http://localhost:3000/order-confirm/${orderId}`,
            website_url: "http://localhost:3000",
            amount: total,
            purchase_order_id: orderId,
            purchase_order_name: "Purchase Sneaker",
            customer_info: {
              name: "ram bahadur",
              email: "test@khalti.com",
              phone: "9823456789",
            },
          }),
        },
      );
      const { payment_url: paymentUrl } = await paymentResponse.json();
      console.log(paymentUrl);
      return res.status(200).json({
        success: true,
        paymentUrl,
      });
    } else {
      return res.status(409).json({
        success: false,
      });
    }
  } catch (err) {
    console.error("Error making order", err);
    return res.status(500).json({
      status: false,
      message: "Oops, Server error",
    });
  }
}

export async function confirmOrder(req: Request, res: Response) {
  try {
  } catch (err) {
    console.error("Error confirming order", err);
  }
}
