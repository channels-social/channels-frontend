import { domainUrl } from './globals';

// export const extractSubdomain = (url) => {
//     const mainDomain = domainUrl;
//     const host = url.hostname;
//     if (!host.endsWith(mainDomain)) {
//       return null;
//     }
//     const parts = host.split('.');
//     if (parts.length >= 3 && parts[0] !== 'www') {
//       return parts[0];
//     }
  
//     return null;
//   };


  export const extractSubdomain = (url) => {
    const mainDomain = domainUrl.replace(/^www\./, ''); 
    const host = url.hostname;
  
    if (!host.endsWith(mainDomain)) {
      return null;
    }
    const parts = host.split('.');
    if (parts.length === 2 || (parts.length === 3 && parts[0] === 'www')) {
      return null;
    }
    if (parts.length >= 3) {
      return parts.slice(0, parts.length - mainDomain.split('.').length).join('.');
    }
    return null;
  };