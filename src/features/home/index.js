import React, { useState, useEffect } from 'react';
import { Icon, Label, Menu, Table } from 'semantic-ui-react';
import moment from 'moment';
import { getTranslations } from 'api';
import { useTranslation } from 'react-i18next';

moment().format();


function Home() {
  const { t } = useTranslation();
  const [transl, setTransl] = useState([]);

  useEffect(() => {
    getTranslations().then((r) => {
      setTransl(r.data)
    });
  }, []);

  return (
    <div className="Home">
      <h3>{t('home_header', 'Prior Translations')}</h3>

      <Table celled>
          <Table.Header><Table.Row>
                          <Table.HeaderCell>{t('table_header_time', 'Time')}</Table.HeaderCell>
                          <Table.HeaderCell>{t('table_header_model', 'Model')}</Table.HeaderCell>
                          <Table.HeaderCell>{t('table_header_source', 'Source')}</Table.HeaderCell>
                          <Table.HeaderCell>{t('table_header_target', 'Target')}</Table.HeaderCell>
                          <Table.HeaderCell>{t('table_header_revision', 'Revision')}</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
        {transl.map((t) =>
          <Table.Row style={{fontSize: "14px"}}>
            <Table.Cell>{moment(t.timestamp).format("YYYY-MM-DD HH:mm")}</Table.Cell>
            <Table.Cell>{t.model}</Table.Cell>
            <Table.Cell>{t.source_text}</Table.Cell>
            <Table.Cell>{t.target_text}</Table.Cell>
            <Table.Cell>{t.translationcorrection_set.length !== 0 ? t.translationcorrection_set[t.translationcorrection_set.length - 1].target_text : ""}</Table.Cell>
          </Table.Row>
        )}
        </Table.Body>

        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell colSpan='5'>
             
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    </div>
  )
}

export default Home;
