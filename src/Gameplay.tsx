import { ChangeEvent, useState, useEffect } from 'react';
import React from 'react';
import { json, useParams } from 'react-router-dom';
// import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js';
import { ref, set, update, onValue } from 'firebase/database';
import { db } from './tscom/firebase-config'; // Adjust the path as necessary

import { getFromLocalStorage, setToLocalStorage } from './tscom/localStorageUtils';

import { Person, Status, RoundData } from './type/types';


const GameComponent = () => {
  const [currentPlayerID, setCurrentPlayerID] = useState<string | null>(null);

  const [gameRound, setGameRound] = useState(1);
  const [Rounddata, setRounddata] = useState<[]>([]);
  const [Alldata, setAlldata] = useState<RoundData | undefined>(undefined);

  // console.log('aaa', Alldata)
  //當前使用者的觀看目標
  // const [lookdata, setlookdata] = useState<[]>([]);
  const [lookData, setLookData] = useState<number[]>([]);
  //要寫入的資料
  const [Looktxt, setLooktxt] = useState<string>('');

  const [isCurrentUserTurn, setIsCurrentUserTurn] = useState(false);
  const players = ['player1ID', 'player2ID', 'player3ID', 'player4ID', 'player5ID', 'player6ID', 'player7ID', 'player8ID'];
  //取房間router
  let { roomId } = useParams();
  const playpeopleRef = ref(db, `roomservice/${roomId}`);
  let userData = getFromLocalStorage<Person>('userdata'); //本地資料
  useEffect(() => {
    const unsubscribe = onValue(playpeopleRef, async (snapshot: any) => {
      const data = snapshot.val();
      console.log(data)
      // const { round1,round2,round3}: { round1: RoundData, round2: RoundData, round3: RoundData} = data;
      const { round1, round2, round3, memdata, otherStatus }: RoundData = data;
      setAlldata(data)
      // 先解构

      if (round3) { }
      else if (round2) { } else {

        setRounddata(data.rounddata[2])
      }

      //  let {round1:number[]}=data  

      console.log('位置狀態', round1)
      console.log('當前本地', userData)
      let round = round1 || []
      console.log('為什麼',round)
      console.log('問題', round[round.length - 1] , userData?.color)
      //此處看到一定會FALSE 因isCurrentUserTurn當下未更新 當不影響 因最後會被USEEFFECT更新
      // setIsCurrentUserTurn(round[round.length - 1] == userData?.color); //判定當前使用者
      setIsCurrentUserTurn(round[round.length - 1].toString() == userData?.color);
// 
      console.log('當前可作人員', round[round.length - 1], userData?.color, isCurrentUserTurn, '此時判定還會是FALSE 因還沒更新')
      //寫入一 個當前人員顯示
      let col: string | null = userData!.color
      setCurrentPlayerID(col)

      //以下為設置資料
      // setCurrentPlayerID(data.currentPlayerID);
      // setGameRound(data.gameRound);
      // const currentUserID = localStorage.getItem('currentUserID');

    });

    return () => unsubscribe();
  }, []);
  //選擇看的目標
  const selectlook = (idx: number) => {
    // const [lookdata, setlookdata] = useState<string>('');
    //這邊將資料寫入本地 方便讀取也避免作弊? 同data丟出
    // console.log('這個', lookData.length < 1)
    // console.log('條件2', lookData.length < 2 && userData?.name == '許願')
    if (lookData.length < 1 || (lookData.length < 2 && userData?.name == '許願'
    )) {
      //此處data宣告需丟到外部 避免許願判定錯誤
      // console.log('這個是雜魚2', Alldata)
      // console.log('查看otherStatus', Alldata?.otherStatus);

      console.log('這個是雜魚', Alldata?.otherStatus)
      console.log('這個是壞人', Alldata?.memdata)
      let otherStatus: { hua: number; mu: number } | undefined = Alldata?.otherStatus
      let memdata: Status | undefined = Alldata?.memdata
      // let roun = Alldata?.round3 ? 3 : Alldata?.round2 ? 2 : 1
      let roun = Alldata?.round3 ? 3 : (Alldata?.round2 ? 2 : 1);

      let data = []
      data.push(idx)
      console.log('dad', data)
      setLookData(data)
      let aa = Looktxt + Rounddata[idx]


      if ((userData?.name == '黃嫣嫣' && otherStatus!.hua == roun) || userData?.name == '木戶家奈' && (otherStatus!.mu == roun)) {
        // otherStatus
        setLooktxt('鑑定結果為無法鑑定')
      }
      else {
        setLooktxt(aa)
      }


    }

  }
  //技能欄位
  const updateAtValue = (ele: string) => {
    if (ele == 'chg') {
      if (Alldata?.memstaus?.chg) {
        Alldata.memstaus.chg.at = Rounddata.length;
      }

    }

    if (ele == 'r') {
      if (Alldata?.memstaus?.r) {
        Alldata.memstaus.r.at = Rounddata.length;
      }

    }

  }

  //這邊步操作直接轉到下一位
  const handleAction = () => {
    // const currentIndex = players.indexOf(currentPlayerID);
    const nextIndex = (currentIndex + 1) % players.length;
    const nextPlayerID = players[nextIndex];
    const isNewRound = nextIndex === 0;
    const nextRound = isNewRound ? gameRound + 1 : gameRound;

    update(ref(db, 'gameStatus'), {
      currentPlayerID: nextPlayerID,
      gameRound: nextRound
    }).then(() => {
      alert('操作完成，轮到下一位');
    }).catch((error) => {
      console.error("Error updating game status: ", error);
    });
  };

  return (
    <div>
      {/* {Alldata ? (
        <div>
         {JSON.stringify(Alldata)}
        </div>
      ) : (
        <p>No data available.</p>
      )} */}


      <h1>Game Round: {gameRound}</h1>
      <h2>Current Player: {currentPlayerID}</h2>
      {isCurrentUserTurn ? (

        <>

          {/* <button onClick={xx}>選擇查驗 </button> */}
          {/* <button onClick={xx}>這是技能 </button> */}

          <button onClick={handleAction}>查驗後並給使用技能最後給下一位 </button>
        </>
      ) : (
        // Rounddata.map(data=>)

        <>
          <h2>當前生肖</h2>
          <div className="row">

            {lookData.length == 0 || (lookData.length < 2 && userData?.name === '許願') ? (
              Rounddata.map((ele, index) => (
                <p className="col-6" key={`c${index}`} onClick={() => selectlook(index)}>
                  {lookData[0] === index ? ele : ele[0]}
                </p>
              ))
            ) : (
              <span>{Looktxt}</span>
            )}
            {/* 技能 */}
            {/* && userData?.name === '鄭國渠' */}
            {!Alldata?.memstaus?.chg.at  ?

              <span>
                <input type="checkbox" id="toggle2" className="toggle-checkbox" />
                <label htmlFor="toggle2">使用技能</label>
                <div className="toggle-content">
                  {Array.isArray(Rounddata) ? (
                    Rounddata.map((idm) => (
                      <React.Fragment key={idm}>
                        <input id={idm[0]} type="radio" value=''></input>
                        <label htmlFor={idm[0]}>{idm[0]}</label></React.Fragment>
                    ))
                  ) : (
                    ''
                  )}

                </div>

                <span>確定<input type="checkbox"

                  onClick={() => updateAtValue('chg')}
                /></span>
                : ''
              </span> : ''

            }


            {/* && userData?.name === '藥不然' */}
            {!Alldata?.memstaus?.yai.at ?
              <span>
                <input type="checkbox" id="toggle" className="toggle-checkbox" />
                <label htmlFor="toggle">使用技能</label>
                <div className="toggle-content">
                  {Array.isArray(Alldata?.memdata) ? (
                    Alldata.memdata.map((co, idx) => (
                      <React.Fragment key={`at${co.idx}`}>
                        <input id={co.color} type="radio" value=''></input>
                        <label htmlFor={co.color}>{co.admname + co.color}</label></React.Fragment>
                    ))
                  ) : (
                    ''
                  )}

                </div>
              </span>
              : ''}
            {!Alldata?.memstaus?.r.at && userData?.name === '老嘲諷' ?
              <span>使用技能<input type="checkbox" onClick={() => updateAtValue('r')} /></span>
              : ''}



          </div>
          {/* onClick={() => { if ((!selectobj && !person.locked) || (selectobj && !selectobj.locked && !person.locked)) selectmem(index); }} */}
          <p>等待 {currentPlayerID} 操作...</p>
        </>

      )
      }
    </div >
  );
};


export default GameComponent;
