import React, {useState, useEffect} from "react";
import { getDailyUsers, getTop3PostsWithMostDislikes, getTop3PostsWithMostLikes, getTop3UsersWithMostDailyProfileVisits } from "../data/repository"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';



ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);


export function ActiveCharts() {

    const [dailyUserDataset, setDailyUserDataset] = useState([]);
    const [dateList, setDateList] = useState([]);
    const [dailyUsers, setDailyUsers] = useState(null);

    const [userPostList, setUserPostList] = useState([]);
    const [reactionsDataset, setReactionsDataset] = useState([]);
    const [postReactions, setPostReactions] = useState(null);

    const [userPost2List, setUserPost2List] = useState([]);
    const [dislikesDataset, setDislikesDataset] = useState([]);
    const [postDislikes, setPostDislikes] = useState(null);

    const [profilesList, setProfilesList] = useState([]);
    const [visitsDataset, setVisitsDataset] = useState([]);
    const [profileVisits, setProfileVisits] = useState(null);
  
    const loadDailyUsersData = async() => {
      const dailyUsersData = {
        labels: dateList,
        datasets: [
          {
            label: 'Daily Active Users',
            data: dailyUserDataset,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
        ],
      };
      setDailyUsers(dailyUsersData);
    }

    const loadPostReactionsData = async () => {
      const postReactionsData = {
        labels: userPostList,
        datasets: [
          {
            label: 'The Number of Received Likes',
            data: reactionsDataset,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
        ],
      };
      setPostReactions(postReactionsData);
    }

    const loadPostDislikesData = async () => {
      const postDislikesData = {
        labels: userPost2List,
        datasets: [
          {
            label: 'The Number of Received Dislikes',
            data: dislikesDataset,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
        ],
      };
      setPostDislikes(postDislikesData);
    }

    const loadProfileVisitsData = async () => {
      const profileVisitsData = {
        labels: profilesList,
        datasets: [
          {
            label: `The Frequencies of Visits of Users'\ Profiles`,
            data: visitsDataset,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
        ],
      };
      setProfileVisits(profileVisitsData);
    }
  
    const loadStatsData = async () => {
      let dateList = []
      var date = new Date();
      date.setDate(date.getDate() + 1);
      for (let i = 0; i < 7; i++) {
        date.setDate(date.getDate() - 1);
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yyyy = date.getFullYear();
        dateList.push( yyyy +  '-' + mm + '-' + dd)
      }
      dateList.reverse();
      setDateList(dateList);

      const weekUseList = []
      for (let i = 0; i < dateList.length; i++) {
        weekUseList.push( await getDailyUsers(dateList[i]))
      }
      setDailyUserDataset(weekUseList);

      const top3likes = await getTop3PostsWithMostLikes();
      let usersposts = []
      let likes = []
      top3likes.forEach(top => {
        usersposts.push(top.author + "_" + top.post_id);
        likes.push(top.reactions);
      });
      setUserPostList(usersposts);
      setReactionsDataset(likes);

      const top3dislikes = await getTop3PostsWithMostDislikes();
      let usersposts2 = []
      let dislikes = []
      top3dislikes.forEach(top => {
        usersposts2.push(top.author + "_" + top.post_id);
        dislikes.push(top.reactions);
      });
      setUserPost2List(usersposts2);
      setDislikesDataset(dislikes);

      const today = new Date()
      const yr = String(today.getFullYear())
      const mo = String(today.getMonth() +1)
      const dy = String(today.getDate())
      const todate = yr + "-" + mo + "-" + dy;
      // alert(todate)
      const top3ProfileVisits = await getTop3UsersWithMostDailyProfileVisits(todate)
      let profiles = []
      let visits = []
      top3ProfileVisits.forEach(top => {
        profiles.push(top.username);
        visits.push(top.visits);
      });
      setProfilesList(profiles);
      setVisitsDataset(visits);
    }
  
    useEffect(() => {loadStatsData();}, []);

    useEffect(() => {loadDailyUsersData();}, [dateList,dailyUserDataset]);
    useEffect(()=> {loadPostReactionsData()}, [userPostList, reactionsDataset]);
    useEffect(()=> {loadPostDislikesData()}, [userPost2List, dislikesDataset]);
    useEffect(()=> {loadProfileVisitsData()}, [profilesList,visitsDataset]);
  
    const lineChartOptions = (title) => {
      return {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: title
          },
        },
      };
    }

    const barChartOptions = (title) => {
      return {
        indexAxis: 'x' ,
        elements: {
          bar: {
            borderWidth: 2,
          },
        },
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: title,
          },
        },
      };
    }
  
    return (
      <>
        {/* <div style={{height:'400px',width:'500px'}} className="stats_linechart">
        // {/* className="stats_linechart" */}
          {/* {data ? (<Line options={options} data={data} />) : <></>} */}
          {/* height={10} width={20} */}
        {/* </div> */}
        {/* <div >
          {data ? (<Line options={options} data={data} style={{height:'300px',width:'600px'}}/>) : <></>} 
        </div> */}
        <div className="stats_norththwest">
          <div style={{height:'300px',width:'500px'}}>
            {dailyUsers ? (<Line options={lineChartOptions('Weekly Active Users')} data={dailyUsers} />) : <></>}
            {postReactions ? (<Bar options={barChartOptions('Top 3 Posts with most likes')} data={postReactions} />) : <></>}
          </div>
        </div>
        <div className="stats_northeast">
          <div style={{height:'300px',width:'500px'}}>
            {dailyUsers ? (<Bar options={lineChartOptions('Top 3 popular profiles today')} data={profileVisits} />) : <></>}
            {dailyUsers ? (<Bar options={lineChartOptions('Top 3 Posts with most dislikes')} data={postDislikes} />) : <></>}
          </div>
        </div>
      </>
    );
  }
  