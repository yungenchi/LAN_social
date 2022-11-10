import React, { useContext, useEffect, useState } from "react";
import UserSelectContext from "../contexts/UserSelectContext";
import {getFollowersOf, getFollowingsOf} from "../data/repository"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
ChartJS.register(ArcElement, Tooltip, Legend);


function FollowMetric() {

// ----- Follow data part -------------------------
    const {userSelect, setUserSelect} = useContext(UserSelectContext);
    const [followers, setFollowers] = useState([]);
    const [followings, setFollowings] = useState([]);

    const loadFollowData = async () => {
        const newFollowers = await getFollowersOf(userSelect.username)
        const newFollowerings = await getFollowingsOf(userSelect.username)
        setFollowers(newFollowers);
        setFollowings(newFollowerings);
    }

// ----- Chart data part -------------------------
const [chartData, setChartData] = useState([]);
const [dataFrame, setDataFrame] = useState(null);

    const da = {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
        {
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
        },
        ],
    }   

    const options = {
        responsive: false,
        title: "title"
   }

   const updateChartData = () => {
        const followerNum = followers.length
        const followingNum = followings.length
        setChartData([followerNum, followingNum])
   }

   const updateDataFrame = async () => {
        const df = {
            labels: ["followers", "followings"],
            datasets: [
                {
                    label:'# of people',
                    data: chartData,
                    borderWidth: 1,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        ],
                        borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        ],
                }
            ]
        }
        setDataFrame(df)
   }

// ----- useEffect ------------------------------

//    update seleted user
   useEffect(() =>{
       loadFollowData();
   },[userSelect])

//    update follow data
    useEffect(() =>{
        updateChartData()
        updateDataFrame()
    },[followers, followings])

// // update chart data
//     useEffect(() =>{
//         updateDataFrame()
//     },[dataFrame])

  return (
    <div>
        {dataFrame && <Doughnut options={options} data={dataFrame}/>}
    </div>
  );
}

export default FollowMetric;
