// import { useState } from 'react'
import { ChangeEvent, useState, useEffect } from 'react';
import { json, useParams, useNavigate } from 'react-router-dom';
// import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js';
import { ref, set, update, onValue } from 'firebase/database';
import { db } from './tscom/firebase-config'; // Adjust the path as necessary

import { getFromLocalStorage, setToLocalStorage } from './tscom/localStorageUtils';
// tsconfig設定@縮路徑 目前路徑對了 但網頁會抱錯 待查
// import { getFromLocalStorage, setToLocalStorage } from '@/tscom/localStorageUtils';

//引入類別
import { Person, Status } from './type/types';






// const firebaseConfig = {
//   apiKey: "AIzaSyAhGVvIf7mvJZkSqCz2Cfs98oSWhZokLks",
//   authDomain: "pure-wall-356711.firebaseapp.com",
//   projectId: "pure-wall-356711",
//   storageBucket: "pure-wall-356711.appspot.com",
//   messagingSenderId: "530616305644",
//   appId: "1:530616305644:web:c9069ac1f0285c10abe2c9",
//   measurementId: "G-ZTME5HYJHL",
//   databaseURL: 'https://pure-wall-356711-default-rtdb.asia-southeast1.firebasedatabase.app/'
// };
// const app = initializeApp(firebaseConfig);
// const db = getDatabase(app);






function App() {



  //此處後先所
  let initialPeople: Person[] = [
    { idx: 0, admname: '黑色', name: '', color: '灰',colore:'gray', q: false, r: false, atked: false, locked: false },
    { idx: 1, admname: '白色', name: '', color: '白',colore:'white', q: false, r: false, atked: false, locked: false },
    { idx: 2, admname: '藍色', name: '', color: '藍',colore:'blue', q: false, r: false, atked: false, locked: true },
    { idx: 3, admname: '紫色', name: '', color: '紫',colore:'purple', q: false, r: false, atked: false, locked: true },
    { idx: 4, admname: '綠色', name: '', color: '綠',colore:'green', q: false, r: false, atked: false, locked: true },
    { idx: 5, admname: '紅色', name: '', color: '紅',colore:'red', q: false, r: false, atked: false, locked: true },
    { idx: 6, admname: '橘色', name: '', color: '橘',colore:'orange', q: false, r: false, atked: false, locked: true },
    { idx: 7, admname: '黃色', name: '', color: '黃',colore:'yellow', q: false, r: false, atked: false, locked: true }
  ];
  let colors: string[] = ['許願', '方震', '黃嫣嫣', '木戶家奈', '老嘲諷', '藥不然', '鄭國渠', '姬浮雲']
  const navigate = useNavigate();
  const [people, setPeople] = useState(initialPeople);

  const [forceUpdate, setForceUpdate] = useState(false); // 添加一個用於強制更新的狀態

  const [adm, setadm] = useState('請輸入姓名');
  // const [selectobj, setselectobj] = useState({});
  const [selectobj, setselectobj] = useState<Person | null>(null);
  //是否當前玩家
  // const [isCurrentUserTurn, setIsCurrentUserTurn] = useState(false);


  const selectmem = (idx: number) => {
    //纖纖重製當前值 然後才寫入

    //若有人選過 不能用初始資料 此處用深拷貝
    const updatedPeople = JSON.parse(JSON.stringify(people)); // 取得初始值


    if (!adm) {
      setadm('無名玩家')
    }
    console.log('需更新資料people', people)
    // people[selectobj.idx]] //解綁
    // people[selectobj.idx]] //綁定 這兩個狀態互換該如何好
    console.log('要變成得', idx);
    console.log('取消的', selectobj?.idx);
    if (selectobj && selectobj.idx != undefined) {
      console.log('問題點以選的', people[selectobj.idx])
      console.log('改的取消直', updatedPeople[selectobj.idx])
      people[selectobj.idx].admname = ''

    }





    // updatedPeople[idx].admname = adm || '無名玩家'; // 更新副本中的值
    // updatedPeople[idx].name = Selectename;

    people[idx].admname = adm || '無名玩家'; // 更新副本中的值
    // people[idx].name = Selectename;
    //此處需判定若原有選擇 將原有資料清掉 
    console.log('沒進來', people[idx], adm)

    setPeople(people); // 将更新寫入
    setselectobj(people[idx]) //寫入當前使用者角色資料
    setForceUpdate(prevState => !prevState);
  }
  // const [Selectename, setSelectename] = useState('黃嫣嫣');
  // const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
  //   setSelectename(event.target.value);
  // };
  //開始遊戲 
  const startGame = () => {
    alert('開始動作')
    // 隨機排列生肖 是否須改架構
    const zodiacs = [{ zod: "鼠", tf: false },
    { zod: "牛", tf: false },
    { zod: "虎", tf: false },
    { zod: "兔", tf: false },
    { zod: "龍", tf: false },
    { zod: "蛇", tf: false },
    { zod: "馬", tf: false },
    { zod: "羊", tf: false },
    { zod: "猴", tf: false },
    { zod: "雞", tf: false },
    { zod: "狗", tf: false },
    { zod: "豬", tf: false }];
    for (let i = zodiacs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [zodiacs[i], zodiacs[j]] = [zodiacs[j], zodiacs[i]];
    }
    // 分組且寫入為真的生肖
    const groupedZodiacs = [];
    for (let i = 0; i < zodiacs.length; i += 4) {
      const group = zodiacs.slice(i, i + 4);
      groupedZodiacs.push(group);
    }
    // 放入真值
    const result = groupedZodiacs.map((group) => {
      let randomIndices = new Set<number>();
      while (randomIndices.size < 2) {
        const randomIndex = Math.floor(Math.random() * group.length);
        randomIndices.add(randomIndex);
      }
      randomIndices.forEach((index) => {
        group[index].tf = true;
      });
      console.log('此處需為輪次資料', group);
      return group;
    });
    //           nonEmptyAdmnames這東西要最後一次寫入data
    // const startNumber = Math.floor(Math.random() * people.length); //選擇起始顏色位置 
    //此處是否不要用idx 直接用顏色 &需寫入其他未選定腳色


    // 從 people 數組中隨機選擇一個值
    const randomIndex = Math.floor(Math.random() * people.length);
    const startColor = people[randomIndex].color;
    // 從原始數組中刪除選擇的值
    const remainingColors = [...people.slice(0, randomIndex), ...people.slice(randomIndex + 1)].map(ele=>ele.color)

    console.log('隨機選擇的值：', startColor);
    console.log('剩餘的值：', remainingColors);







    // console.log('起始顏色', startNumber, people, people[startNumber].color)
    // console.log('全部', result)

   
    //此處先寫入直 再撈出
    //開始寫入輪次 這邊動作完就換人 應不需等待 此處應只需寫入idx或顏色判斷即可 不須寫其他資料?
    //使用狀態 是否分開寫?
    let memstatus: Status = {
      r: { at: '', nu: null },
      chg: { at: '', nu: null },
      yai: { at: '', nu: null }

    };


    let otherStatus: { hua: number; mu: number } = {
      hua: Math.floor(Math.random() * 3) + 1,
      mu: Math.floor(Math.random() * 3) + 1
    };
    // let otherStatus: { hua: number; mu: number } = { hua: 0, mu: 2 };
    // return false
    let round1: string[] = [startColor]
    update(playpeopleRef, {
      round1: round1,
      memstaus: memstatus,
      otherStatus: otherStatus,
      rounddata: result,
      startgame: true
    });

    // return false
    navigate(`/GamePlay/${roomId}`);
    // <Route path="/GamePlay/:roomId" element={<GamePlay />} />


  }





  //單一玩家送出資料
  const sendmem = async (n: number = 0) => {
    console.log('這什麼', selectobj)
    const userData = getFromLocalStorage<Person>('userdata');
    if (!!n) {
      // 從local中取資料取消鎖定
      // let item: Person = JSON.parse(localStorage.getItem('userdata'))

      if (!!userData) {
        console.log('來取消資料', userData.idx)

        userData.locked = false;
        let notlocked = setToLocalStorage<Person>('userdata', userData);
        people[userData.idx].locked = false;
        // selectobj!.locked=false
        // setselectobj(selectobj)
        //不建議上述寫法 因為react不見一直些修改原值 就算他能修改
        setselectobj({ ...userData, locked: false }); // 安全地更新selectobj状态，因为我们知道userData不是null

        setPeople(people); // 将更新寫入
        console.log('看看取消', userData)
        set(playpeopleRef, {
          memdata: people
        });
        return
      }
    }
    //寫入local判定
    // localStorage.setItem('userdata', JSON.stringify(setPeople))
    // const isSuccess = setToLocalStorage<Person>('userdata', people);
    //這邊不對 不應該寫入array 待改 寫入obj
    if (!selectobj) alert('請先選擇資料')
    console.log('nowdata', selectobj)
    if (selectobj) {

      people[selectobj.idx].locked = true;

      setPeople(people); // 将更新寫入
      console.log('這邊沒寫進去', people[selectobj.idx])
      // userData!.locked = true;
      let islocked = setToLocalStorage<Person>('userdata', selectobj);
      console.log('沒改道', islocked)
      console.log('看看鎖定', selectobj)
      set(playpeopleRef, {
        memdata: people
      });
    }

    // if (isSuccess) {
    //   console.log('用户数据已保存');
    // } else {
    //   console.log('用户数据保存失败');
    // }
    //寫入data
    // await set(playpeopleRef, {
    //   // name: {'aa':'53'},
    //   // description: "This is a new room."
    //   memdata:people
    // }); 


  }

  //取房間router
  let { roomId } = useParams();

  //先設定房間路徑
  const playpeopleRef = ref(db, `roomservice/${roomId}`);
  console.log('來看看目前的router位置', `roomservice/${roomId}`)
  useEffect(() => {
    const unsubscribe = onValue(playpeopleRef, async (snapshot: any) => {
      const data = snapshot.val();
      if (data == null) { // 检查数据是否不存在
        console.log('無資料 寫入資料');
        try {
          colors
          people
          // 此處將資料寫入隨機寫入 20240525更新
          for (let i = colors.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [colors[i], colors[j]] = [colors[j], colors[i]];
          }
          console.log('隨機排列', colors)
          colors.forEach((element, index) => {
            people[index].name = element;
          });
          console.log('被改變的people')
          // return false
          // 
          await set(playpeopleRef, {
            // name: {'aa':'53'},
            // description: "This is a new room."
            memdata: people
          });
          console.log('資料寫入data 放入頁面');
        } catch (error) {
          console.error('error:', error);
        }
      } else {
        // 如有資料 丟入頁面
        console.log('載入時取的資料與更新時顯示');
        console.log('Data:', data.memdata);
        console.log('Data:', Array.isArray(data.memdata));
        console.log('所有資料:', data);
        console.log('目前選擇玩家:', data.round1);
        console.log('這邊要把資料篩掉 應判定陣列有值 是否換頁面:', data.round1);

        //如判定道已開始 直接轉址
        console.log('沒反應', data.startgame)
        if (
          data.startgame) navigate(`/GamePlay/${roomId}`);
        //此處應以開始遊戲 換頁設定妥當
        setPeople(data.memdata)
        const userData = getFromLocalStorage<Person>('userdata');

        console.log('若以創立則data為', userData)
        if (!!userData) setselectobj(userData)
        console.log(typeof selectobj)
        console.log('未設定就會錯', selectobj)

        // setIsCurrentUserTurn(userData === data.players[data.memdata].id);

      }
    });


    // 清理函数
    return () => {
      unsubscribe();
    };
  }, []);  // 空依赖数组意味着这个 effect 只在组件加载时运行一次
  useEffect(() => {
    console.log('selectobj 状态更新后的值：', selectobj, people);
  }, [selectobj, people])
  return (
    <>
      房間資料
      <div>房间 ID：{roomId}</div>
      <br />
      <label htmlFor="adm"> 姓名:  <input id='adm' name='adm' type="text" value={adm} onChange={(e) => setadm(e.target.value)} /></label>
      <br />
      {/* <label htmlFor="name"> 角色:

        <select name="name" id="name" onChange={handleSelectChange} value={Selectename}>
          {colors.map((co, idx) => (
            <option value={co} key={idx} style={{ background: co }}>{co}</option>
          ))}
        </select></label> */}
      <br />


      <div className="row">

        {people.map((person, index) => (
          <div className='col-3 text-center py-3' key={person.color} style={{ background: person.colore }}
            onClick={() => { if ((!selectobj && !person.locked) || (selectobj && !selectobj.locked && !person.locked)) selectmem(index); }}

          // onClick={() => selectmem(index)}
          >
            {selectobj && <div>{selectobj.locked}123</div>}
            {(!selectobj && !person.locked) ? '問題是' : '否'}
            {(person.locked) ? '是' : '否'}
            {person.admname}
            {person.name}
            {person.locked ? '鎖定' : ''}
            <br />

          </div>
        ))}

      </div>
      {/* react中 不能在響應中直接使用一部函式 所以不能直接寫 onClick={sendmem}
      音異部會返回promise 但這邊不需要 所以 用()=> void 
      async function fetchData() {
        // 异步操作
      }

      // 我们不关心 fetchData 的返回值
      void fetchData();
      */}
      <button onClick={() => void sendmem()}>鎖定</button>
      <button onClick={() => void sendmem(1)}>取消鎖定</button>
      {people.every(person => person.locked) && (
        <button onClick={startGame}>開始遊戲</button>
      )}


    </>
  )
}

export default App
