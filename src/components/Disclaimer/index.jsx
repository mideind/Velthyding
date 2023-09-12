import { useTranslation } from "react-i18next";
import { Message } from "semantic-ui-react";

export default function Disclaimer() {
  const { t } = useTranslation();
  return (
    <div className="App-body disclaimer">
      <Message info size="big">
        <Message.Header>
          {t("disclaimer-header", "About Vélþýðing.is")}
        </Message.Header>
        <p>
          {t(
            "disclaimer-content",
            "This website is under active development. No responsibility is taken for the quality of translations. All translations are made using a neural network and the output can be unpredictable and biased."
          )}
        </p>
        <p>
          {t(
            "disclaimer-cookie",
            "By using this service you agreee to our use of cookies. Translations may be logged for quality assurance purposes."
          )}
        </p>
        <p>{t("disclaimer-last-updated", "Last updated: ")} 2023-09-12</p>
      </Message>
    </div>
  );
}
