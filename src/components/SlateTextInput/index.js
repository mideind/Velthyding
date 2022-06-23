import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Editable } from "slate-react";

function SlateElement(props) {
  return <p {...props.attributes}>{props.children}</p>;
}
function SlateLeaf(props) {
  return (
    // eslint-disable-next-line
    <span
      onMouseOver={() => props.setHoverId(props.leaf.uId)}
      // eslint-disable-next-line
      {...props.attributes}
      style={{
        marginRight: "5px",
        backgroundColor:
          props.hoverId && props.leaf.uId === props.hoverId ? "azure" : "white",
      }}
    >
      {props.children}
    </span>
  );
}
export default function SlateTextInput({
  hoverId,
  setHoverId,
  translateFunc,
  isTranslation,
}) {
  const { t } = useTranslation();

  const renderElement = useCallback((innerProps) => {
    // eslint-disable-next-line
    return <SlateElement {...innerProps} />;
  }, []);

  const renderLeaf = useCallback(
    (innerProps) => {
      // eslint-disable-next-line
      return (
        <SlateLeaf {...innerProps} hoverId={hoverId} setHoverId={setHoverId} />
      );
    },
    [setHoverId, hoverId]
  );

  const handleCtrlEnter = (event) => {
    if (event.key === "Enter" && event.ctrlKey) {
      event.preventDefault();
      translateFunc();
    }
  };
  const placeholderText = isTranslation
    ? ""
    : t("slate_placeholder", "Enter text..");
  return (
    <div style={{ height: "100%" }}>
      <Editable
        spellCheck="false"
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder={placeholderText}
        autoFocus={!isTranslation}
        onKeyDown={handleCtrlEnter}
        style={{ height: "100%" }}
      />
    </div>
  );
}
