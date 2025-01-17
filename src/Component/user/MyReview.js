import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

import useFirebase from "../Hook/useFirebase";
import useFunc from "../Hook/useFunc";
import Rviews from "../Pages/Home/Rviews";
import Loader from "../ShareComponent/Loader";

const MyReview = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReview] = useState(null);
  const { userToken } = useFunc();
  const { user } = useFirebase();

  useEffect(() => {
    fetch(
      `https://server.switchcafebd.com/cyclemart/reviews?user_id=${user._id}`,
      {
        headers: {
          authorization: userToken(),
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setReview(data);
      })
      .finally(() => setIsLoading(false));
  }, [user._id, userToken]);

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div>
      {reviews ? (
        <div className='lg:grid grid-cols-3 gap-4 md:m-10'>
          {reviews.map((review) => (
            <Rviews key={review._id} review={review} />
          ))}
        </div>
      ) : (
        <div>
          <p className='text-center text-xl py-8 text-gray-500'>
            You didn't make any review
          </p>
          <div className='flex justify-center'>
            <NavLink className='button' to='/my-account/add-review'>
              Add-Review
            </NavLink>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReview;
