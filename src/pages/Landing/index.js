import Logo from "../../assets/icons/logoTecnoclima.png";
import LoginForm from "../../components/forms/LoginForm";
import LandingLayout from "../../layout/LandingLayout";

export default function Landing() {
  return (
    <LandingLayout>
      <div className="flex relative h-full w-full">
        <img
          className="absolute top-10 left-10 w-80 max-w-full"
          src={Logo}
          alt=""
        />
        <LoginForm />
      </div>
    </LandingLayout>
  );
}
