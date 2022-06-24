import mideindLogo from "../../mideind.svg";

export default function Footer() {
  return (
    <div className="Footer">
      <div className="Footer-logo">
        <a href="https://mideind.is">
          <img alt="logo" src={mideindLogo} width="67" height="76" />
        </a>
        <p>Miðeind ehf., kt. 591213-1480</p>
        <p>Fiskislóð 31, rými B/303, 101 Reykjavík</p>
        <p>
          <a href="mailto:mideind@mideind.is">mideind@mideind.is</a>
        </p>
      </div>
    </div>
  );
}
