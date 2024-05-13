// Person 类型
export type Person = {
    idx: number;
    admname: string;
    name: string;
    color: string;
    q: boolean;
    r: boolean;
    atked: boolean;
    locked: boolean;
  };
  
  //  StatusDetail 和 YaiDetail 
  export type StatusDetail = {
    at: number | '';
    nu: number | null;
  };
  
  export type YaiDetail = {
    at: string | '';
    nu: number | null;
  };
  
  // Status
  export type Status = {
    r: StatusDetail;
    chg: StatusDetail;
    yai: YaiDetail;
  };
//   export type RoundData = {
//     round1: string[];
//     round2: number[];  // 假设 round2 是 number 数组类型
//     round3: boolean[]; // 假设 round3 是 boolean 数组类型
// };
// export type RoundData =  number[]|undefined;


export interface RoundData {
    round1: number[] | undefined;
    round2: number[] | undefined;
    round3: number[] | undefined;
}

  