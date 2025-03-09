import React, { useEffect, useState } from "react";
import "./coursedescription.css";
import { server } from "../../main";
import { useNavigate, useParams } from "react-router-dom";
import { CourseData} from "../../context/CourseContext";
import { UserData } from "../../context/UserContext";
import Loading from "../../components/loading/Loading";
import axios from "axios";
import toast from "react-hot-toast";

const CourseDescription = ({ user }) => {
  const params = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const { fetchUser } = UserData();
  const { fetchCourse, course } = CourseData();

  useEffect(() => {
    fetchCourse(params.id);
  }, []);

  const enrollCourse = async () => {
    
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to continue");
      navigate("/login");
      return;
    }
    
    setLoading(true);
    console.log(params.id);
    try {
      const { data } = await axios.post(
        `${server}/api/course/checkout/${params.id}`,
        {}, // No need to send body
        {
          headers: {
            token,
          },
        }
      );
  
      await fetchUser();
      await fetchCourse(params.id);
      setLoading(false);
      toast.success(data.message);
      navigate(`/${user._id}/dashboard`);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
      setLoading(false);
    }
  };
  

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          {course && (
            <div className="course-description">
              <div className="course-header">
                <img
                  src={`${server}/${course.image}`}
                  alt="Course Image"
                  className="course-image"
                />
                <div className="course-info">
                  <h2>{course.title}</h2>
                  <p>Instructor: {course.createdBy}</p>
                  <p>Duration: {course.duration} weeks</p>
                </div>
              </div>

              <p>{course.description}</p>

              {user && user.subscription.includes(course._id) ? (
                <button
                  onClick={() => navigate(`/course/study/${course._id}`)}
                  className="common-btn"
                >
                  Study
                </button>
              ) : (
                <button onClick={enrollCourse} className="common-btn">
                  Enroll
                </button>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default CourseDescription;
