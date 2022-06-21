import { getTranslations } from "api/translations";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Navigate } from "react-router-dom";
import { Table } from "semantic-ui-react";

moment().format();

function Home({ loggedin }) {
  const { t } = useTranslation();
  const [transl, setTransl] = useState([]);

  useEffect(() => {
    getTranslations().then((r) => {
      setTransl(r.data);
    });
  }, []);

  if (!loggedin) {
    return <Navigate to="/login" />;
  }
  return (
    <div className="Home">
      <h3>{t("home_header", "Prior Translations")}</h3>

      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>
              {t("table_header_time", "Time")}
            </Table.HeaderCell>
            <Table.HeaderCell>
              {t("table_header_model", "Model")}
            </Table.HeaderCell>
            <Table.HeaderCell>
              {t("table_header_source", "Source")}
            </Table.HeaderCell>
            <Table.HeaderCell>
              {t("table_header_target", "Target")}
            </Table.HeaderCell>
            <Table.HeaderCell>
              {t("table_header_revision", "Revision")}
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {transl.map((trans) => (
            <Table.Row key={trans.id} style={{ fontSize: "14px" }}>
              <Table.Cell>
                {moment(trans.timestamp).format("YYYY-MM-DD HH:mm")}
              </Table.Cell>
              <Table.Cell>{trans.model}</Table.Cell>
              <Table.Cell>{trans.source_text}</Table.Cell>
              <Table.Cell>{trans.target_text}</Table.Cell>
              <Table.Cell>
                {trans.translationcorrection_set.length !== 0
                  ? trans.translationcorrection_set[
                      trans.translationcorrection_set.length - 1
                    ].target_text
                  : ""}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>

        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell colSpan="5" />
          </Table.Row>
        </Table.Footer>
      </Table>
    </div>
  );
}

export default Home;
