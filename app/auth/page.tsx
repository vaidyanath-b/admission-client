"use client"
import React from "react";
import {Tabs, Tab, Input, Link, Button, Card, CardBody, CardHeader} from "@nextui-org/react";
import { AuthContext } from "@/context/auth/context";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, signUpWithEmailAndPassword } from "../actions";

export default function App() {

    const router = useRouter();
  const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within a AuthProvider");
    }
    const {user , setUser} = context;
    if (user) {
        router.push("/form");
    }
  const [selected, setSelected] = React.useState<any>("login");

  const handleSignup = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(e.currentTarget.email.value , "hello ");
    await signUpWithEmailAndPassword({
        email: e.currentTarget.email.value,
        password: e.currentTarget.password.value,
        confirm: e.currentTarget.password.value,
    });


}
const handleSignin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await signInWithEmailAndPassword({
        email: e.currentTarget.email.value,
        password: e.currentTarget.password.value,
    });
}
  return (
    <div className="flex flex-col w-full justify-center items-center md:h-full">
      <Card className="max-w-full md:w-1/3 md:h-3/4 md:pt-3 md:px-4">
      <CardHeader>
        <h4 className="text-center font-sans font-bold text-2xl w-full mb-2">MEC</h4>
        </CardHeader>   
        <CardBody className="overflow-hidden">
          <Tabs
            fullWidth
            size="md"
            aria-label="Tabs form"
            selectedKey={selected}
            onSelectionChange={setSelected}
          >
            <Tab key="login" title="Login">
              <form className="flex flex-col gap-4" onSubmit={handleSignin}>
                <Input isRequired label="Email" name="email" placeholder="Enter your email" type="email" />
                <Input
                  isRequired
                  label="Password"
                  name="password"
                  placeholder="Enter your password"
                  type="password"
                />
                <p className="text-center text-small">
                  Need to create an account?{" "}
                  <Link size="sm" onPress={() => setSelected("sign-up")}>
                    Sign up
                  </Link>
                </p>
                <div className="flex gap-2 justify-end">
                  <Button fullWidth color="primary" type="submit">
                    Login
                  </Button>
                </div>
              </form>
            </Tab>
            <Tab key="sign-up" title="Sign up">
              <form className="flex flex-col gap-4 h-[300px]" onSubmit={handleSignup}>
                <Input name="email" isRequired label="Email" placeholder="Enter your email" type="email" />
                <Input
                  isRequired
                  label="Password"
                  name="password"
                  placeholder="Enter your password"
                  type="password"
                />
                                 <Input
                  isRequired
                  name="confirm"
                  label="confirm password"
                  placeholder="Confirm your password"
                  type="password"
                />

                <p className="text-center text-small">
                  Already have an account?{" "}
                  <Link size="sm" onPress={() => setSelected("login")}>
                    Login
                  </Link>
                </p>
                <div className="flex gap-2 justify-end">
                  <Button fullWidth color="primary" type="submit">
                    Sign up
                  </Button>
                </div>
              </form>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
}
