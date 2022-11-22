import './App.css';
import { useEffect, useRef, useState } from 'react';
import { isEmpty, size, uniqBy } from 'lodash';
import { Button, Modal } from 'antd';
import 'antd/dist/antd.css';
import TuiImageEditor from 'tui-image-editor';
import 'tui-image-editor/dist/tui-image-editor.css';
import styles from './global.module.scss';

const dataImage = [
  'https://phuongiang-dev-api-files.greenglobal.com.vn/file-general/993/iFr25UWJ1dNhgkCkIzwxTpBEdnh3LeqydF2R5nl0.jpg',
  'https://phuongiang-dev-api-files.greenglobal.com.vn/file-general/990/idaLxHxV17mNJlf4wLftI1E8AKCp1qDuOXGkj6UT.jpg',
  'https://phuongiang-dev-api-files.greenglobal.com.vn/file-general/994/awxnPINLybjmRAcPLHSnKt3BsaV4OZiIQaT7au2Q.jpg',
  'https://phuongiang-dev-api-files.greenglobal.com.vn/file-general/1529/hur6i2snDssHQVcuBF3I3KPZLDM06Tn6HPverKAx.jpg',
  'https://phuongiang-dev-api-files.greenglobal.com.vn/file-general/1531/P7PKFyRCUFbsCtQ28dtBgfNzRNzhWBR7dXIENyLd.jpg',
];

function EditorImage() {
  const refImg = useRef(null);
  const [imgEdit, setEdit] = useState()
  const [images, setImage] = useState([]);
  const [visible, setVisible] = useState(false);
  const [sizes, setSize] = useState([]);
  const imageEditorInst = useRef(null);

  useEffect(() => {
    dataImage.forEach((item, index) => {
      const tag_img = new Image();
      tag_img.src = item;
      tag_img.onload = () => {
        setSize(prev => [...prev, { width: tag_img.width, height: tag_img.height, index }])
      }
    })
  }, []);

  useEffect(() => {
    if (size(sizes) >= size(dataImage)) {
      const tag_img = new Image();
      const resize = async () => {
        const result = await uniqBy(sizes, "index").reduce(async (a, b, index) => {
          tag_img.src = dataImage[index];
          const item = await a;
          return [...item, { id: `image-${index}`, src: dataImage[index] }]
        }, []);
        setImage(result)
      };
      resize();
    }

  }, [sizes]);

  useEffect(() => {
    if (!isEmpty(imgEdit)) {
      imageEditorInst.current = new TuiImageEditor(refImg.current, {
        includeUI: {
          loadImage: {
            path: imgEdit?.src,
            name: imgEdit?.id,
          },
          menu: ['shape', 'filter', 'resize', 'text', 'crop', 'draw', 'icon', 'rotate', 'flip'],
          initMenu: 'resize',
          uiSize: {
            width: '100%',
            height: '90vh',
          },
          menuBarPosition: 'left',
        },
        cssMaxHeight: 500,
        cssMaxWidth: 700,
        selectionStyle: {
          cornerSize: 20,
          rotatingPointOffset: 70,
        },
        usageStatistics: true
      });
    }
  }, [imgEdit]);

  const chooseImage = (value) => {
    const itemFind = images.find(item => item.id === value);
    setEdit(itemFind)
    setVisible(true)
  }

  const onSave = () => {
    // console.log(imageEditorInst.current.toDataURL())
    // console.log(imageEditorInst.current.ui.resize._originalDimensions)
    setImage(prev => prev.map(item => item.id === imgEdit.id ? { ...item, ...imageEditorInst.current.ui.resize._originalDimensions, src: imageEditorInst.current.toDataURL() } : item))
    setVisible(false);
    setEdit({});
    imageEditorInst.current.destroy();
    imageEditorInst.current = null;

  };

  const handleCancel = () => {
    setVisible(false);
    setEdit({});
    imageEditorInst.current.destroy();
    imageEditorInst.current = null;
  };
  const onView = () => {
    try {
      console.log(imageEditorInst.current.toDataURL())
      localStorage.clear()
      localStorage.setItem('dataUrl', imageEditorInst.current.toDataURL());
      window.open('/view', '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.log("size ảnh quá lớn, ko thể lưu trong localStorage")
    }
  }

  return (
    <>
      <Modal
        open={visible}
        width="100%"
        title=""
        onOk={onSave}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={onSave}>
            Save
          </Button>,
          <Button
            key="link"
            type="primary"
            ghost
            onClick={onView}
          >
            View image
          </Button>,
        ]}
      >
        {
          !isEmpty(imgEdit) && (
            <div className={styles['img-edit']}>
              <div ref={refImg} />
            </div>
          )
        }
      </Modal>
      <div className='p-3'>
        <div className={styles['block-image']}>
          {images?.map((item) => (
            <img src={item?.src} alt={item?.id} key={item?.id} onClick={() => chooseImage(item?.id)} />
          ))}
        </div>
      </div>
    </>
  );
}

export default EditorImage;
