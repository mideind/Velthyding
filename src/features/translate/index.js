import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useSelector, useDispatch } from 'react-redux';

import mammoth from 'mammoth';
import ClipLoader from 'react-spinners/ClipLoader';
import { Button } from 'semantic-ui-react';

import 'App.css';
import Translator from 'components/Translator';
import { translateMany } from 'actions/translations';
import { storeTranslation } from 'api';
import { setTranslation, setToggle, clearAll } from './translateSlice';


function Translate() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [trans, setTrans] = useState([]);
  const engines = useSelector((state) => state.engines);
  const { source, target } = useSelector((state) => state.login);
  const dispatch = useDispatch();

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      const isDocx = file.path.split('.')[1] === 'docx';
      reader.onload = () => {
        if (isDocx) {
          mammoth.extractRawText({ arrayBuffer: reader.result }).then((result) => {
            const extractedText = result.value;
            setText(extractedText);
          }).done();
        } else {
          setText(reader.result);
        }
      };
      if (isDocx) {
        reader.readAsArrayBuffer(file);
      } else {
        reader.readAsText(file);
      }
    });
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  useEffect(() => {
    if (text.trim() === '') {
      dispatch(clearAll());
    }
  }, [text, dispatch]);

  const translateButton = <Button
    primary
    className="TranslateBox-submit"
    onClick={async () => {
      if (!text) {
        return;
      }
      setLoading(true);
      const trans = await translateMany(
        engines.filter((engine) => engine.selected),
        text,
        source,
        target,
      );
      trans.map((t) => dispatch(setTranslation({ name: t.engine.name, text: t.text })));
      setTrans(trans);
      trans.map((t) => storeTranslation(`${source}-${target}`, t.engine.name, text, t.text.join('\n\n')));
      setLoading(trans === []);
    }}>
    {loading ? <ClipLoader size={10} color={'#FFF'} /> : <span> Translate </span>}
  </Button>;

  const uploadButton = <Button className="TranslateBox-submit TranslateBox-upload" {...getRootProps()}>
    <input {...getInputProps()} />
    {
      isDragActive ? <span>Drop here</span> : <span>Upload</span>
    }
  </Button>;

  return (
    <div>
      {translateButton}
      <Translator
        sourceText={text}
        targetText={trans}
        setText={setText}
        setTargetText={setTrans}
      />
      <div className="Translate">
        <div className="Translate-footer">
          <div className="Translate-engines">
            {engines.map((engine, idx) => (
              <div className="Checkbox" key={`cb-${idx}`}>
                <label>
                  <input
                    type="checkbox"
                    checked={engine.selected}
                    onChange={() => dispatch(setToggle(engine.name))} />
                  {engine.name} - {engine.url}
                </label>
              </div>
            ))}
          </div>
          {uploadButton}
          {translateButton}
        </div>
      </div>
    </div>
  );
}

export default Translate;
