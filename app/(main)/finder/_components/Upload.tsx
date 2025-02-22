'use client';

import { useContext, useRef } from 'react';
import { MdFileUpload, MdFileUploadOff } from 'react-icons/md';

import { upload } from '@/app/(main)/finder/_utils/upload';
import { ConfigContext } from '@/contexts';
import { Uploader } from '@/modules/uploader';
import { useCommonStore, useShowProgressStore } from '@/store';

const Upload = () => {
  // const [isUploading, setIsUploading] = useState(false);
  const isUploading = useCommonStore((state) => state.isUploading);
  const inputRef = useRef<HTMLInputElement>(null);
  const config = useContext(ConfigContext);
  const server = `${config?.server_protocol}://${config?.server_host}:${config?.server_port}`;

  const handleCancel = () => {
    Uploader.isClosed = true;
    useCommonStore.getState().setIsUploading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    /* 检查文件数量 */
    const fileList = e.target.files;
    if (!fileList) return;

    useShowProgressStore.getState().setShowProgress(true);

    upload(Array.from(fileList), server);

    /* 得做清空操作，否则第二次选择相同内容时无法触发 onChange 事件 */
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <>
      <input type="file" multiple ref={inputRef} className="hidden" onChange={(e) => handleFileChange(e)} />
      {isUploading ? (
        <button
          className="flex items-center space-x-1.5 rounded-md border bg-warning py-1 pl-2.5 pr-3 hover:opacity-90"
          onClick={handleCancel}
        >
          <MdFileUploadOff size={20} />
          <span>取消</span>
        </button>
      ) : (
        <button
          className="flex items-center space-x-1.5 rounded-md border bg-upload-button py-1 pl-2.5 pr-3 hover:bg-button-hover"
          onClick={() => inputRef.current?.click()}
        >
          <MdFileUpload size={20} />
          <span>上传</span>
        </button>
      )}
    </>
  );
};

export default Upload;
