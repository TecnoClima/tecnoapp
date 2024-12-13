import Logo from "../../assets/icons/logoTecnoclima.png";
import LoginForm from "../../components/forms/LoginForm";
import LandingLayout from "../../components/Layout/LandingLayout";

export default function Landing() {
  return (
    <LandingLayout>
      <div className="flex relative h-full w-full">
        <div className="flex w-full flex-col p-4 h-full">
          <img className="w-80 max-w-full" src={Logo} alt="" />

          <LoginForm />
        </div>
      </div>
    </LandingLayout>
  );
}
