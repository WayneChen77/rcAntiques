import { useState } from 'react'

import { useNavigate, Link  } from 'react-router-dom';
function App() {
  const [admname, setadmname] = useState('請輸入玩家名稱')
  const [roomnum, setroomnum] = useState('當前房號')
  const navigate = useNavigate();
  // const go = () => {

  //   navigate('/serveroom');
  // }
  const preRoom = () => {    
      let a=Math.random().toString(36).substr(2,8); 
      console.log('a',a)
        // 移除開頭 0 和小數點，n 自訂
        //此處要切換route寫入資料(實時連線)並輸出畫面 只寫入顏色
        setroomnum(a) //房號傳送


        // 顏色資料載入新檔寫           
            //  var playpeople = ref(db, "playpeople");
            //   set(playpeople, this.playpeople);
        
        // let userPeople = ref(db, `${this.roomNum}/userPeople`);
        // set(userPeople, this.userPeople);
     
    

    navigate(`/serveroom/${a}`);
  }
  const checkIn=()=>{
    navigate(`/serveroom/${roomnum}`);

  }
  return (
    <>

      {/* <Link to="/serveroom">321</Link> */}
      <div>
        <label htmlFor="name">玩家姓名:</label>
        <input id="name" type="text" value={admname}  onChange={(e)=>{setadmname(e.target.value)}}/>
        <br />
        <label htmlFor="roomNum">房號</label>
        <input id="roomNum" type="text" placeholder="請輸入房號"  value={roomnum} onChange={(e)=>{setroomnum(e.target.value)}}/>
        <button className="btn" onClick={checkIn}>進入房間</button>
        <br />
        <button className="btn" onClick={preRoom}>開1新房間</button>
      </div>





      {/* <button onClick={go}>進入房間</button> */}

    </>
  )
}

export default App
