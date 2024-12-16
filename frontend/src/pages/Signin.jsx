import { SubHeading } from "../components/SubHeading";
import { Heading } from "../components/Heading";
import { BottomWarning } from "../components/BottomWarning";
import { InputBox } from "../components/InputBox";
import { Button } from "../components/Button";

export const Signin = () => {
   return (
      <div className="bg-slate-300 h-screen flex justify-center">
         <div className="flex flex-col justify-center">
            <div className="rounded-lg bg-white w-96 text-left p-2 h-max px-4">
               <Heading label={"Sign in"} />
               <SubHeading
                  label={"Enter your credentials to access your account"}
               />

               <InputBox placeholder="harkirat@gmail.com" label={"Email"} />
               <InputBox placeholder="123456" label={"Password"} />

               <div className="pt-4">
                  <Button label={"Sign in"} />
               </div>

               <BottomWarning
                  label={"Don't have an account?"}
                  buttonText={"Sign up"}
                  to={"/signup"}
               />
            </div>
         </div>
      </div>
   );
};
