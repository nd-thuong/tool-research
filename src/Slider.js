import { Button, Form, Input, Radio } from "antd";
import React, { useRef, useState } from "react";
import ReactPlayerFb from 'react-player/facebook';
import ReactPlayerYt from 'react-player/youtube';
import { Carousel } from 'react-bootstrap';
import Iframe from 'react-iframe'
import "react-bootstrap-carousel/dist/react-bootstrap-carousel.css";
import "bootstrap/dist/css/bootstrap.css";
import styles from './global.module.scss';

const Slider = () => {
  const [slides, setSlide] = useState([]);
  const [open, setOpen] = useState(false);
  const [formRef] = Form.useForm();
  const refYt = useRef(null);
  const refFb = useRef(null);
  const [playing, setPlaying] = useState({
    fb: 0,
    yt: 0
  });

  const onAdd = values => {
    const { url, duration, type } = values;
    setSlide(prev => [...prev, { url, duration, type }]);
    formRef.resetFields();
  };

  const showSlide = () => {
    if (slides[0].type === 'video') {
      if (slides[0]?.url?.includes("facebook")) {
        setPlaying(prev => ({ ...prev, fb: 1 }))
      }
      if (slides[0]?.url?.includes("youtube") || slides[0]?.url?.includes("youtu")) {
        setPlaying(prev => ({ ...prev, yt: 1 }))
      }
    }
    setOpen(prev => !prev);
  };

  const onSlide = (item) => {
    if (slides[item]?.type === 'video') {
      if (slides[item]?.url?.includes('youtube') || slides[item]?.url?.includes('youtu')) {
        setPlaying(prev => ({ ...prev, yt: 1 }));
        refYt.current.seekTo(0, 'seconds');
      }
      if (slides[item]?.url?.includes('facebook')) {
        setPlaying(prev => ({ ...prev, fb: 1 }));
        refFb.current.seekTo(0, 'seconds');
      }
    }

    if (slides[item]?.type !== 'video') {
      setPlaying({ yt: 0, fb: 0 })
    }
  };

  const getSlide = (item, index) => {
    const { type, url } = item;
    switch (type) {
      case 'image':
        return (
          <img
            className="d-block w-100"
            src={url}
            alt="First slide"
          />
        );

      case 'webview':
        return (
          <Iframe url={url}
            width="100%"
            height="100%"
            id=""
            className=""
            display="block"
            position="relative"
          />
        );

      case 'video':
        return url?.includes("facebook") ?
          <ReactPlayerFb
            className='react-player'
            ref={refFb}
            url={url}
            width="100%"
            height="100%"
            volume={playing.fb}
            playing={true}
          />
          :
          <ReactPlayerYt
            className='react-player'
            ref={refYt}
            url={url}
            width="100%"
            height="100%"
            volume={playing.yt}
            playing={true}
          />;

      default:
        break;
    }
  };

  const onSelect = (item) => {
    // console.log('select')
    const index = item - 1;
    if (item > 0 && slides[index].type === 'video') {
      if (slides[index].url?.includes("youtube") || slides[index].url?.includes("youtu")) {
        setPlaying(prev => ({ ...prev, yt: 0 }));
      }
      if (slides[index].url?.includes("facebook")) {
        setPlaying(prev => ({ ...prev, fb: 0 }));
      }
    }
  }

  const onSlid = () => {
    console.log('slid')
  };

  return (
    <div className="p-5">
      {!open ? <Form layout="vertical" form={formRef} onFinish={onAdd}>
        <div className="row d-flex flex-column align-items-center justify-content-center">
          <div className="col-4">
            <Form.Item name="url" label="Đường dẫn">
              <Input placeholder="Nhập đường dẫn" />
            </Form.Item>
          </div>
          <div className="col-4">
            <Form.Item name="duration" label="Thời gian">
              <Input placeholder="duration" />
            </Form.Item>
          </div>
          <div className="col-4">
            <Form.Item name="type" label="Loại slide">
              <Radio.Group options={[{ value: 'video', label: 'Video' }, { value: 'image', label: 'Image' }, { value: 'webview', label: 'Web view' }]} />
            </Form.Item>
          </div>
          <div className="col-4">
            <Button type="primary" ghost htmlType="submit">Add slide</Button>
          </div>
          <div className="col-4">
            <Button type="primary" onClick={showSlide}>Show slide</Button>
          </div>
        </div>
      </Form> :
        (<div className="row d-flex justify-content-center">
          <div className="col-9">
            <div className={styles.slide}>
              <Carousel onSlide={onSlide} fade={true} pause={false} >
                {slides?.map((item, index) => (
                  <Carousel.Item interval={Number(item.duration)} key={item.url} className={styles['carousel-item']}>
                    {getSlide(item, index)}
                  </Carousel.Item>
                ))}
              </Carousel>
            </div>
            <Button type="primary" onClick={showSlide}>Cancel slide</Button>
          </div>
        </div>)}
    </div>
  );
};

export default Slider;
