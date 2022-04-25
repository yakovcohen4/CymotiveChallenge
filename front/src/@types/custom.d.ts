declare module '*.svg';
declare module '*.mp4';
declare module '*.png';

declare namespace DataInterface {
  interface data {
    numberofreports: string;
    numberofanomalies: string;
    numberofvehicles: string;
  }
  type dataName = 'numberofreports' | 'numberofanomalies' | 'numberofvehicles';
}
