"use client"
import Card from '@/components/DashBoard/card/card'
import React, { useEffect, useState } from 'react'
import styles from '@/components/DashBoard/dashbar.module.css'
import { userinfo } from "@/components/DashBoard/user/userinfo";
import { banUser, getListUser, getListJob } from "@/components/controller";
import Guidance from '@/components/DashBoard/guidance/guidance';
import { jobInfo } from "@/components/DashBoard/user/userinfo";

interface Job {
  job_id: any;
  name: any;
  status: any;
  location: any;
  type: any;
  post_time: any;
  salary: any;
  experience: any;
}



const Page = () => {
  const [data, setDataJob] = useState<jobInfo[]>([]);
  const [tdata, setData] = useState<userinfo[]>([]);
  const fetchdata = async () => {
    setData(await getListUser());
  };
  const fecthjob = async()=>{
    setDataJob(await getListJob());
  }
  React.useEffect(() => {
    fetchdata();
    fecthjob();
  }, []);
  //const [isLoading, setIsLoading] = useState<boolean>(true); // New loading state
  const cards = [
    {
      id: 1,
      title: "Total Users",
      number: tdata.length == 0 ? "loading" : tdata.length, 
      change: 12,
    },
    {
      id: 2,
      title: "Total Jobs",
      number:  data.length == 0 ? "loading" : data.length,
      change: -2,
    }
  ];


  return (
    <div className={styles.wrapper}>
      <div className={styles.main}>
      <div className={styles.cards}>
          {cards.map((item) => (
            <Card item={item} key={item.id} />
          ))}
        </div>
        <div className={styles.side}>
        <Guidance />
      </div>
      </div>
      </div>

  )
}
export default page


