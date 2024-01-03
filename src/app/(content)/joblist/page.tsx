"use client";

import AppBar from "@/components/appbar";
import React, { use, useEffect } from "react";
import { dm_sans } from "@/components/fonts";
import { getJob, saveJob, getLocation } from "@/components/controller";
import { requireLogin } from "@/components/popupModal";
import Areaselector from "@/components/Areaselector";
import { ICity, ICountry, IState } from "country-state-city";
import { Country } from "country-state-city";
import Modal from "react-modal";

export default function JobList() {
  const defaultFormData = new FormData();
  defaultFormData.append("location", "All");
  defaultFormData.append("experience", "%");
  defaultFormData.append("type", "%");
  defaultFormData.append("salary", "%");

  const [keywords, setKeywords] = React.useState(
    localStorage.getItem("search_joblist")
  );

  useEffect(() => {
    // listen to enter clicked
    window.addEventListener(
      "keypress",
      (e) => {
        if (e.key == "Enter") {
          if (localStorage.getItem("joblist_reset") == "true") {
            localStorage.setItem("joblist_reset", "false");
            setKeywords(localStorage.getItem("search_joblist"));
            setFormData(defaultFormData);
          }
        }
      },
      false
    );
  }, []);

  const [formData, setFormData] = React.useState(defaultFormData);
  const [jobs, setJobs] = React.useState<any[]>([]);
  const [locations, setLocations] = React.useState<any[]>([])
  const [loginRequired, setLoginRequired] = React.useState<boolean>(false);

  React.useEffect(() => {
    const jobList = getJob(formData);
    jobList.then((jobs) => {
      setJobs(jobs || []);
    });

    const locationList = getLocation()
    locationList.then((locations) => {
      setLocations(locations || null);
    });
  }, [formData]);

  return (
    <>
      <AppBar />
      <main
        className={`flex flex-col h-[100vh] ${dm_sans.className} overflow-hidden`}
      >
        {requireLogin(loginRequired, () => setLoginRequired(false))}
        <JobListClient
          jobs={jobs}
          locations={locations}
          setFormData={(data) => setFormData(data)}
          setLoginRequired={setLoginRequired}
          keywords={keywords || ""}
        />
      </main>
    </>
  );
}

function JobListClient({
  jobs,
  locations,
  setFormData,
  setLoginRequired,
  keywords,
}: {
  jobs: any[];
  locations: any[];
  setFormData: (formData: FormData) => void;
  setLoginRequired: (logedIn: boolean) => void;
  keywords: string;
}) {
  let countryData = Country.getAllCountries();
  const [country, setCountry] = React.useState<ICountry>(countryData[0]);
  const [state, setState] = React.useState<IState | undefined>(undefined);
  const [city, setCity] = React.useState<ICity | undefined>(undefined);
  const locationString = `${city?.name || ""} ${", " + state?.name || ""} ${", " + country?.name || ""}`;
  const [selectLocation, setSelectLocation] = React.useState<boolean>(false);
  const [isAll, setIsAll] = React.useState<boolean>(true);
  const [sortOption, setSortOption] = React.useState("none");
  const keywordsArray = keywords.split(" ");

  const filteredJobs = jobs.filter((job) => {
    let isMatch = true;
    keywordsArray.forEach((keyword) => {
      if (job.name.toLowerCase().indexOf(keyword.toLowerCase()) == -1) {
        isMatch = false;
      }
    });
    return isMatch;
  });

  const formatDateToDDMMYYYY = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const calculateAverageSalary = (salaryRange: any) => {
    // Assuming the salary range is in the format "min-max"
    const [min, max] = salaryRange.split('-').map(Number);
    return (min + max) / 2;
  };

  if (sortOption === "salary-inc") {
    filteredJobs.sort((a, b) => calculateAverageSalary(a.salary) - calculateAverageSalary(b.salary));
  } else if (sortOption === "salary-des") {
      filteredJobs.sort((a, b) => calculateAverageSalary(b.salary) - calculateAverageSalary(a.salary));
  }



  return (
    <div className="flex flex-row h-full w-full space-x-[2vw]">
      <div className="flex flex-col w-[15vw] min-h-full">
        <h1 className="flex flex-row w-full text-center text-lg font-bold">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
            viewBox="0 0 36 36"
            fill="none"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M3.48389 3.48389H25.5484V8.71211L17.9107 16.2748V21.8119L11.1216 24.3871V16.2748L3.48389 8.71211V3.48389ZM5.18116 5.13117V8.03942L12.8189 15.6021V21.9747L16.2134 20.6871V15.6021L23.8511 8.03942V5.13117H5.18116Z"
              fill="black"
            />
          </svg>
          Filter your choices
        </h1>
        <form
          name="filter"
          className="flex flex-col w-full space-y-[1vh]"
          action={(data) => {
            setFormData(data);
          }}
        >
          <div>
            <label htmlFor="location">Location</label>
            <select name="location" className="rounded-lg bg-gray-300 w-full">
              <option value="All">All</option>
              {locations.map((location) => 
                <option value={location.location}>{location.location}</option>
              )
              }
            </select>
          </div>
          <div>
            <label htmlFor="experience">Experience</label>
            <select name="experience" className="rounded-lg bg-gray-300 w-full">
              <option value="%">All</option>
              <option value="none">None</option>
              <option value="fresher">Fresher</option>
              <option value="mid_level">Mid-level</option>
              <option value="senior">Senior</option>
            </select>
          </div>
          <div>
            <label htmlFor="type">Type</label>
            <select name="type" className="rounded-lg bg-gray-300 w-full">
              <option value="%">All</option>
              <option value="fulltime">Fulltime</option>
              <option value="parttime">Parttime</option>
              <option value="intern">Intern</option>
            </select>
          </div>
          <div>
            <label htmlFor="salary" className="w-full">
              Salary
            </label>
            <select name="salary" className="rounded-lg bg-gray-300 w-full">
              <option value="%">All</option>
              <option value="0-5">0 - 5 million</option>
              <option value="5-10">5 - 10 million</option>
              <option value="10-20">10 - 20 million</option>
            </select>
          </div>
          <button>Apply</button>
          <div className="rounded-lg bg-gray-300 w-full h-[12vw]">
            <div className="flex flex-row w-full pt-[1vw]">
              <h1 className="text-center text-xl w-full">Banner</h1>
            </div>
          </div>
        </form>
      </div>
      <div className="flex flex-col h-full w-[55vw]">
        <div className="flex flex-row w-full justify-between">
          <h1 className="flex flex-row text-center text-2xl font-bold">
            Results:
          </h1>
          <div className="flex flex-row w-fit">
            <label htmlFor="sort" className="text-center text-xl">
              Sort by:
            </label>
            <select name="sort" onChange={(e) => {setSortOption(e.target.value)}}>
              <option value="none">None</option>
              <option value="salary-inc">Salary (increasing)</option>
              <option value="salary-des">Salary (descreasing)</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col w-full h-full space-y-[2vw] overflow-y-scroll no-scrollbar">
          <div className="flex flex-col h-full w-full">
            <ul className="flex flex-col h-full w-full space-y-[2vh]">
              {filteredJobs.map((job) => (
                <li className="flex flex-row w-full border-2 border-black rounded-md">
                  <div
                    className="flex flex-row w-full"
                    onClick={() => {
                      const job_id = job.job_id as string;
                      localStorage.setItem("job_id", job_id);
                      window.location.href = "/jobdetail";
                    }}
                  >
                    <div className="flex m-[1vw]">
                      <img
                        className="w-[10vw] h-[10vw]"
                        src={job.employer_logo || "logo.svg"}
                        alt=""
                      />
                    </div>
                    <div className="flex flex-col justify-between w-full p-[1vw]">
                      <div className="flex flex-row justify-between w-full">
                        <h1 className="text-xl font-bold">{job.name}</h1>
                        <div className="flex flex-row space-x-[1vw] space-y-[0.5vh]">
                          <h1 className="text-xl font-bold">
                            {job.salary} Millions
                          </h1>
                        </div>
                      </div>
                      <div className="flex flex-row w-full">
                        <h1 className="text-lg">{job.employer_name}</h1>
                      </div>
                      <div className="flex flex-row w-full max-w-full">
                        <p className="text-lg">
                          {job.location} ({job.type})
                        </p>
                      </div>
                      <div className="flex flex-row w-full">
                        <h1 className="text-md">
                          {formatDateToDDMMYYYY(new Date(job.post_time))}
                        </h1>
                      </div>
                    </div>
                  </div>
                  <svg
                    className="flex m-[1vw]"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="22"
                    viewBox="0 0 16 22"
                    fill="none"
                    onClick={() => {
                      saveJob(job.job_id).then((res) =>
                        res == false
                          ? setLoginRequired(true)
                          : alert((job.job_id as string) + " saved")
                      );
                    }}
                  >
                    <path
                      d="M1 7.90976C1 4.65247 1 3.02382 1.76884 2.01191C2.53769 1 3.77513 1 6.25 1H9.75C12.2249 1 13.4623 1 14.2312 2.01191C15 3.02382 15 4.65247 15 7.90976V15.7726C15 18.8627 15 20.4078 14.2612 20.8804C13.5225 21.353 12.5994 20.3984 10.7532 18.4892L10.1624 17.8782C9.1243 16.8048 8.60526 16.268 8 16.268C7.39474 16.268 6.8757 16.8048 5.83762 17.8782L5.24678 18.4892C3.4006 20.3984 2.47751 21.353 1.73876 20.8804C1 20.4078 1 18.8627 1 15.7726V7.90976Z"
                      stroke="#33363F"
                      stroke-width="2"
                    />
                  </svg>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="flex flex-col min-h-full w-[25vw] justify-between">
        <div className="flex flex-col h-full space-y-[2vw] w-full">
          <div className="rounded-lg bg-gray-300 w-full h-[20vh]">
            <div className="flex flex-row w-full m-[1vw] text-center text-xl">
              Other features
            </div>
          </div>
          <div className="rounded-lg bg-gray-300 w-full h-[20vh]">
            <div className="flex flex-row w-full m-[1vw] space-x-[2vw]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="22"
                viewBox="0 0 16 22"
                fill="none"
              >
                <path
                  d="M1 7.90976C1 4.65247 1 3.02382 1.76884 2.01191C2.53769 1 3.77513 1 6.25 1H9.75C12.2249 1 13.4623 1 14.2312 2.01191C15 3.02382 15 4.65247 15 7.90976V15.7726C15 18.8627 15 20.4078 14.2612 20.8804C13.5225 21.353 12.5994 20.3984 10.7532 18.4892L10.1624 17.8782C9.1243 16.8048 8.60526 16.268 8 16.268C7.39474 16.268 6.8757 16.8048 5.83762 17.8782L5.24678 18.4892C3.4006 20.3984 2.47751 21.353 1.73876 20.8804C1 20.4078 1 18.8627 1 15.7726V7.90976Z"
                  stroke="#33363F"
                  stroke-width="2"
                />
              </svg>
              <h1 className="text-center text-xl">Saved Jobs</h1>
            </div>
          </div>
        </div>
        <div>
          <div className="flex flex-col rounded-t-2xl bg-gray-300 w-full content-center h-[10vh]">
            <div className="flex flex-row content-center justisfy-center h-full p-[1vw] space-x-[2vw]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
              >
                <circle cx="24" cy="24" r="23.5" fill="white" stroke="black" />
              </svg>
              <h1 className="text-center text-xl h-fit">Messaging</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
