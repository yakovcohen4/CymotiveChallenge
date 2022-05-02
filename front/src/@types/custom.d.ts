declare module '*.svg';
declare module '*.mp4';
declare module '*.png';

declare namespace DataInterface {
  interface data {
    numberofreports: { name: string; value: number };
    numberofanomalies: { name: string; value: number };
    numberofvehicles: { name: string; value: number };
  }
  type dataName = 'numberofreports' | 'numberofanomalies' | 'numberofvehicles';
}
