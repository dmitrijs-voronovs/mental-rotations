declare module "react-hook-screen-orientation" {
  type ScreenOrientation = "portrait-primary" | "landscape-primary";

  function useScreenOrientation(): ScreenOrientation;

  export default useScreenOrientation;
}
