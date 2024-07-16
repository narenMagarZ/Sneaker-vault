import clsx from "clsx";
import React, { SetStateAction, useState } from "react";
import { FieldErrors, UseFormRegister, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import API from "../../utils";
import AppLogo from "../../ui/logo";

export default function JoinUs() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  return (
    <div className="flex p-4 items-center flex-col gap-y-4 justify-center">
      <div className="flex items-center justify-center">
        <AppLogo />
      </div>
      {step === 1 ? (
        <EmailVerificationForm setEmail={setEmail} setStep={setStep} />
      ) : (
        <UserJoinForm email={email} setStep={setStep} />
      )}
    </div>
  );
}

function EmailVerificationForm(props: {
  setStep: React.Dispatch<SetStateAction<number>>;
  setEmail: React.Dispatch<SetStateAction<string>>;
}) {
  const [animateEmail, setAnimateEmail] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<{ email: string }>();
  async function onSubmit(data: { email: string }) {
    try {
      const res = await API("/email-verification", {
        method: "POST",
        data: { email: data.email },
      });
      if (res.status === 200) {
        props.setEmail(data.email);
        props.setStep(2);
      }
    } catch (err) {
      console.error("Error ");
    }
  }
  return (
    <div className="max-w-[450px] text-sm text-gray-700">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-1">
        <div className="flex flex-col gap-y-4">
          <h2 className="">Enter your email to join us or sign in.</h2>
          <div className="relative">
            <div
              style={{ width: "fit-content" }}
              className={clsx(
                "flex items-center justify-center transition duration-200 px-1 justify-center absolute",
                {
                  "bottom-[45px] text-xs": animateEmail,
                  "inset-0 ": !animateEmail,
                },
              )}
            >
              <label className="bg-white px-2 rounded">Email</label>
            </div>
            <input
              onFocus={() => {
                setAnimateEmail(true);
              }}
              className="border w-full text-sm rounded p-4"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "invalid email address",
                },
                onBlur: () => {
                  setAnimateEmail(false);
                },
              })}
            />
          </div>
        </div>
        {errors.email && (
          <p>
            <span className="text-red-500 text-xs">{errors.email.message}</span>
          </p>
        )}

        <p className="">
          By continuing, I agree to SneakerVault &nbsp;
          <Link className="underline" to={"/privacy-policy"}>
            Privacy Policy &nbsp;
          </Link>
          and{" "}
          <Link className="underline" to={"/terms"}>
            Terms of Use.
          </Link>
        </p>
        <div className="text-end">
          <button
            type="submit"
            className="bg-gray-700 hover:bg-gray-800 text-white text-sm rounded p-2"
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}

interface UserJoinForm {
  code: string;
  firstName: string;
  lastName: string;
  password: string;
  dateOfBirth: string;
  agreedToTermsAndPolicy: boolean;
  address: string;
}

function UserJoinForm(props: {
  email: string;
  setStep: React.Dispatch<SetStateAction<number>>;
}) {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserJoinForm>();
  async function onSubmit(data: UserJoinForm) {
    console.log(data);
    try {
      const res = await API.post("join", {
        ...data,
        email: props.email,
      });
      if (res.status === 201) {
        navigate("/collections", { replace: true });
      }
    } catch (err) {}
  }
  return (
    <div className="max-w-[450px] text-sm">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-2">
        <h1 className="">Now let's make you a SneakerVault Member.</h1>
        <div className="flex flex-col gap-y-1">
          We've sent a code to
          <div className="flex items-center gap-x-4">
            <span className="bg-gray-100 px-2">{props.email}</span>
            <button
              className="hover:underline"
              onClick={() => {
                props.setStep(1);
              }}
            >
              Edit
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-y-4">
          <AnimatedInput
            errors={errors}
            name="code"
            label="Code"
            register={register}
          />
          <div className="flex items-center gap-x-2">
            <AnimatedInput
              errors={errors}
              label="First Name"
              name="firstName"
              register={register}
            />
            <AnimatedInput
              errors={errors}
              label="Last Name"
              name="lastName"
              register={register}
            />
          </div>
          <div>
            <AnimatedInput
              errors={errors}
              label="Password"
              name="password"
              register={register}
            />
            <div className="p-2">
              <div className="flex items-center gap-x-2 text-xs">
                <Cross />
                Minimum of 8 characters
              </div>
              <div className="flex items-center gap-x-2 text-xs">
                <Cross />
                Uppercase, lowercase letters and one number
              </div>
            </div>
          </div>
          <div>
            <AnimatedInput
              errors={errors}
              label="Address"
              name="address"
              register={register}
            />
          </div>
          <div>
            <div className="relative">
              <input
                type="date"
                {...register("dateOfBirth", {
                  required: "Date of Birth is required",
                })}
              />
              {errors.dateOfBirth && (
                <p className="absolute">
                  <span>{errors.dateOfBirth?.message}</span>
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-x-4">
            <input
              {...register("agreedToTermsAndPolicy", {
                required: "Check this",
              })}
              className="cursor-pointer"
              type="checkbox"
            />
            <label className="text-sm">
              I agree to Nike's &nbsp;
              <Link to={"/privacy-policy"}>Privacy Policy</Link>
              &nbsp; and &nbsp;
              <Link to={"/terms"}>Terms of Use.</Link>
            </label>
          </div>
        </div>
        <div className="text-end mt-2 text-sm">
          <button className="bg-gray-700 hover:bg-gray-800 text-white rounded p-2">
            Create Account
          </button>
        </div>
      </form>
    </div>
  );
}

function AnimatedInput(props: {
  register: UseFormRegister<any>;
  errors: FieldErrors<UserJoinForm>;
  label: string;
  name: keyof UserJoinForm;
}) {
  const [animateEmail, setAnimateEmail] = useState(false);
  return (
    <div>
      <div className="relative">
        <div
          style={{ width: "fit-content" }}
          className={clsx(
            "flex items-center justify-center transition duration-200 px-1 justify-center absolute",
            {
              "bottom-[45px] text-xs": animateEmail,
              "inset-0 ": !animateEmail,
            },
          )}
        >
          <label className="bg-white px-2 rounded">{props.label}</label>
        </div>
        <input
          onFocus={() => {
            setAnimateEmail(true);
          }}
          className="border w-full text-sm rounded p-4"
          {...props.register(props.name, {
            required: `${props.label} is required`,

            onBlur: () => {
              setAnimateEmail(false);
            },
          })}
        />
      </div>
      {props.errors && (
        <p>
          <span className="text-red-500 text-xs">
            {props.errors[props.name]?.message}
          </span>
        </p>
      )}
    </div>
  );
}

function Cross() {
  return (
    <svg
      aria-label="Error. Your password needs:"
      width="11"
      height="12"
      viewBox="0 0 11 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0.351562 1.35156L9.64823 10.6482" stroke="#757575"></path>
      <path d="M9.64823 1.35156L0.351562 10.6482" stroke="#757575"></path>
    </svg>
  );
}
