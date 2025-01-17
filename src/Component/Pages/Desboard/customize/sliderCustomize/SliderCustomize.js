import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { useForm } from "react-hook-form";

import useFunc from "../../../../Hook/useFunc";

function SliderCustomize() {
  const { register, handleSubmit, reset } = useForm();
  const [form, setShowForm] = useState(false);
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  const { userToken } = useFunc();
  const alart = useAlert();

  useEffect(() => {
    fetch("https://server.switchcafebd.com/cyclemart/sliders")
      .then((res) => res.json())
      .then((data) => setSliders(data));
  }, [update]);

  //post
  const onSubmit = (slider) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("image", slider.image[0]);
    formData.append("url", slider.url);

    fetch("https://server.switchcafebd.com/cyclemart/sliders", {
      method: "POST",
      headers: {
        authorization: userToken(),
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.insertedId) {
          reset();
          alart.show("slider image added successfully");
          setShowForm(false);
          if (update) {
            setUpdate(false);
          } else {
            setUpdate(true);
          }
        }
      })
      .catch((err) => alart.error(err.message))
      .finally(() => setLoading(false));
  };

  //delete
  const deletSlider = (id) => {
    fetch(`https://server.switchcafebd.com/cyclemart/sliders/${id}`, {
      method: "DELETE",
      headers: {
        authorization: userToken(),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.deletedCount > 0) {
          alart.show("image deleted");
          const slider = sliders.filter((item) => item._id !== id);
          setSliders(slider);
        }
      });
  };

  const showForm = (e) => {
    e.stopPropagation();
    setShowForm(true);
  };
  return (
    <div
      onClick={() => setShowForm(false)}
      className='border relative rounded-md pb-10 text-center h-96 overflow-auto'
    >
      <div className='bg-primary rounded-t text-gray-200 sticky top-0 z-10'>
        <p className='font-medium py-2'>Slider</p>
        <button onClick={(e) => showForm(e)} className='slider-add-btn'>
          Add+
        </button>
        <form
          onClick={(e) => {
            e.stopPropagation();
          }}
          className={`${form ? "block" : "hidden"}`}
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className='customize-form'>
            <input
              className='input border-0 w-full'
              {...register("image", { required: true })}
              type='file'
            />
            <span className='input-for-link'>
              <input
                className='input w-full'
                {...register("url", { required: true })}
                placeholder='Url'
              />
              <i className='fas mx-3 fa-link link-icon'></i>
            </span>
            <button disabled={loading} type='submit' className='button'>
              {loading ? "Loading..." : "Submit"}
            </button>
          </div>
        </form>
      </div>

      {sliders.map((slide) => (
        <div
          key={slide._id}
          className='border-b pb-2 customize-slider overflow-hidden z-0'
        >
          <img className='h-32 w-full' src={slide.imgUrl} alt='' />
          <i
            onClick={() => {
              deletSlider(slide._id);
            }}
            className='fas fa-trash-alt customize-slider-icon'
          ></i>
          <p className='text-base'>{slide.url}</p>
        </div>
      ))}
    </div>
  );
}

export default SliderCustomize;
