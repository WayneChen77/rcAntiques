import { ChangeEvent, useState, useEffect } from 'react';
import { json, useParams } from 'react-router-dom';
// import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js';
import { ref, set, update, onValue } from 'firebase/database';
import { db } from './tscom/firebase-config'; // Adjust the path as necessary

import { getFromLocalStorage, setToLocalStorage } from './tscom/localStorageUtils';

import { Person, Status, RoundData } from './type/types';


const GameComponent = () => {
  const [currentPlayerID, setCurrentPlayerID] = useState<string | null>(null);

  const [gameRound, setGameRound] = useState(1);
  const [isCurrentUserTurn, setIsCurrentUserTurn] = useState(false);
  const players = ['player1ID', 'player2ID', 'player3ID', 'player4ID', 'player5ID', 'player6ID', 'player7ID', 'player8ID'];
  //取房間router
  let { roomId } = useParams();
  const playpeopleRef = ref(db, `roomservice/${roomId}`);
  useEffect(() => {
    const unsubscribe = onValue(playpeopleRef, async (snapshot: any) => {
      const data = snapshot.val();
      console.log(data)
      // const { round1,round2,round3}: { round1: RoundData, round2: RoundData, round3: RoundData} = data;
      const { round1, round2, round3 }: RoundData = data;
      // 先解构



      //  let {round1:number[]}=data  
      const userData = getFromLocalStorage<Person>('userdata'); //本地看是否本人
      console.log('位置狀態', round1)
      console.log('當前本地', userData)
      let round = round1 || []
      console.log('問題', round[round.length - 1] == userData?.idx)
      //此處看到一定會FALSE 因isCurrentUserTurn當下未更新 當不影響 因最後會被USEEFFECT更新
      setIsCurrentUserTurn(round[round.length - 1] == userData?.idx); //判定當前使用者
      console.log('當前可作人員', round[round.length - 1], userData?.idx, isCurrentUserTurn, '此時判定還會是FALSE 因還沒更新')
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

  //這邊步操作直接轉到下一位
  const handleAction = () => {
    const currentIndex = players.indexOf(currentPlayerID);
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
      <h1>Game Round: {gameRound}</h1>
      <h2>Current Player: {currentPlayerID}</h2>
      {isCurrentUserTurn ? (

        <>
         <button onClick={xx}>選擇查驗 </button>
            <button onClick={xx}>這是技能 </button>

        <button onClick={handleAction}>查驗後並給使用技能最後給下一位 </button>
        </>
      ) : (
        <p>等待 {currentPlayerID} 操作...</p>
      )}
    </div>
  );
};

export default GameComponent;
