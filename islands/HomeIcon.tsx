export default function HomeIcon() {
  const home = () => {
    window.location.href='/';
  }
  return (
    <a style="background:none;cursor: pointer;" onClick={home}>🏠</a>
  );
}
