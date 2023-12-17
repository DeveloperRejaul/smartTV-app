import React, { useState } from 'react';
import { TableDelete, TableEdit } from '../../assets/svg-icon';
import TableFooter from './TableFooter';
import TableHeader from './TableHeader';
import useDimension from '../../hook/useDimension';
import { checkTextLen } from '../../utils/stringOpration';
import { copy } from '../../utils/utils.fn';
// import Modal from '../modal/Modal';
import DeleteModal from '../modal/DeleteModal';

/**
 * @param titles array data
 * @param items array data
 * @param totalItems string data total number of org items
 * @param handleNext callback function
 * @param handlePrevious  callback function
 * @returns jsx Table component
 */

function TableCom({
  titles, items, handleDelete, handleEdit, totalItems, handleNext, handlePrevious, onSort, filter,
  headerHidden, footerHidden, heightAuto, onSearch, page, hideSort=false,
}) {
  const { OHeight } = useDimension();
  const [isOpen, setIsOpen] = useState(null);

  return (
    <div className='w-full '>
      {
        isOpen? <DeleteModal setIsOpen={setIsOpen} callBack={() => { handleDelete(isOpen); setIsOpen(null); }} /> : ''
      }
      {/* Table Header */}
      { headerHidden || <TableHeader hideSort={hideSort} onSort={onSort} icon={filter} onSearch={onSearch} />}
      <div className=' pt-2 max-h-[calc(100vh-360px)]  overflow-y-scroll  scrollbar ' style={{ height: heightAuto || OHeight / 1.2 }}>

        {/* Table start */}
        <div className='table w-full overflow-x-auto'>

          {/* Table Title */}
          <div className='table-row '>
            {titles.map((e, i) => (
              <div
                key={Math.random()}
                className='table-cell py-2 bg-gray-50 border-y-2 font-NunitoSans font-semibold text-gray-700 pl-5'
              >
                <p>{i===0? 'SL':e}</p>
              </div>
            ))}
          </div>
          {/* Table Body */}
          {items?.map((obj, index) => {
            const columnLen = titles?.length;
            return (
              <div key={Math.random()} className='table-row justify-center odd:bg-gray-100 hover:bg-tints-900/10'>
                {Object.keys(obj).map((e, i) => {
                  if (columnLen > i) {
                    return (
                      <div
                        // onClick={() => i !== columnLen - 1 && copy(obj[e])}
                        key={Math.random()}
                        className={`px-5 table-cell py-2 min-w-[1/6] max-w-[7rem] border-b-2 text-base table-data truncate-1  ${i === 2 ? 'text-blue-600' : 'text-gray-700'} cursor-pointer last:w-[20px] `}
                      >
                        { i===0? (
                          <span>
                            #
                            {String(index+1).padStart(3, '0') }
                          </span>
                        ): i !== columnLen - 1 && (
                          e==='type'?checkTextLen(obj[e].replace(/([A-Z])/g, ' $1').trim().toUpperCase(), 20):checkTextLen(obj[e], 12)
                        ) }
                        {i === columnLen - 1 && (
                          <div className='flex gap-2 w-fit'>
                            <TableEdit className='cursor-pointer stroke-gray-600 hover:stroke-blue-600 w-6 h-6' onClick={() => handleEdit(obj)} />
                            <TableDelete className='cursor-pointer fill-gray-600 hover:fill-red-500' onClick={() => setIsOpen(obj.id)} />
                          </div>
                        )}

                      </div>
                    );
                  }
                })}
              </div>
            );
          })}
        </div>
      </div>
      {/* Footer Part */}
      {footerHidden || (
        <TableFooter
          item={items.length}
          totalItems={totalItems}
          handleNext={handleNext}
          handlePrevious={handlePrevious}
          page={page}
        />
      )}
    </div>
  );
}

export default TableCom;
