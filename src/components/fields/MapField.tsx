import { useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FeatureCollection } from '../../types';
import FieldWrapper from './components/FieldWrapper';

const mapsHost = 'https://maps.biip.lt';

const MapField = ({
  value,
  onChange,
  label,
}: {
  value: FeatureCollection;
  onChange: (value: FeatureCollection) => void;
  label: string;
}) => {
  const iframeRef = useRef<any>(null);

  const handleSaveGeom = useCallback(
    (event: any) => {
      if (event.origin === mapsHost) {
        onChange(JSON.parse(event?.data?.mapIframeMsg?.data));
      }
    },
    [onChange],
  );

  useEffect(() => {
    window.addEventListener('message', handleSaveGeom);
    return () => window.removeEventListener('message', handleSaveGeom);
  }, [handleSaveGeom]);

  const handleLoadMap = useCallback(() => {
    if (!value) return;
    iframeRef?.current?.contentWindow?.postMessage({ geom: value }, '*');
  }, [JSON.stringify(value)]);

  useEffect(() => {
    handleLoadMap();
  }, [handleLoadMap]);

  return (
    <FieldWrapper label={label}>
      <Iframe
        src={`${mapsHost}/edit?types[]=point&closeOnSearch=1`}
        ref={iframeRef}
        width={'100%'}
        allowFullScreen={true}
        onLoad={handleLoadMap}
        aria-hidden="false"
        tabIndex={1}
      />
    </FieldWrapper>
  );
};

export default MapField;

const Iframe = styled.iframe`
  height: 400px;
  width: 100%;
  display: block;
  border: 1px solid #d4d5de;
  border-radius: 4px;
  margin-top: 8px;
`;
