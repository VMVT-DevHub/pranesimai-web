import { toast } from 'react-toastify';
import { theme } from '../styles';

export const getIconUrl = (icon: string, color = theme.colors.primary) => {
  const parser = new DOMParser();
  const svgDocument = parser.parseFromString(icon, 'image/svg+xml');

  const svgElement = svgDocument.querySelector('svg');
  svgElement?.setAttribute('fill', color);

  const coloredIcon = new XMLSerializer().serializeToString(svgDocument);

  const base64SVG = window.btoa(coloredIcon);
  return `data:image/svg+xml;base64,${base64SVG}`;
};

export const handleErrorToast = (message) => {
  toast.error(message, {
    position: 'top-center',
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
  });
};

export const isEmpty = (value: any) => {
  return (
    value === undefined ||
    value === null ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0)
  );
};
