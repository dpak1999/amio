/** @format */
import { Divider, Icon, Message } from "semantic-ui-react";
import { useRouter } from "next/router";
import Link from "next/link";

export const HeaderMessage = () => {
  const router = useRouter();
  const signupRoute = router.pathname === "/signup";

  return (
    <Message
      color="teal"
      attached
      header={signupRoute ? "Get started" : "Welcome Back"}
      icon={signupRoute ? "settings" : "privacy"}
      content={
        signupRoute ? "Create new account" : "Login with Email and password"
      }
    />
  );
};

export const FooterMessage = () => {
  const router = useRouter();
  const signupRoute = router.pathname === "/signup";

  return (
    <>
      {signupRoute ? (
        <>
          <Message attached="bottom" warning>
            <Icon name="help" />
            Existing User? <Link href="/login">Login here instead</Link>
          </Message>
          <Divider hidden />
        </>
      ) : (
        <>
          <Message attached="bottom" info>
            <Icon name="lock" />
            <Link href="/reset">Forgot Password</Link>
          </Message>

          <Message attached="bottom" warning>
            <Icon name="help" />
            New User? <Link href="/signup">Signup here instead</Link>
          </Message>
        </>
      )}
    </>
  );
};
