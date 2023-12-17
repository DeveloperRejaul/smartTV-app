import React from 'react';
import TableHeader from '../../../components/table/TableHeader';
import TableFooter from '../../../components/table/TableFooter';
import Welcome from '../../../components/welcome/Welcome';
import data from '../data.json';
import PlayerContent from '../../../components/PlayerContent/PlayerContent';

function ContentPlayer() {
  return (
    <div className='p-7 flex flex-col space-y-5 text'>
      <Welcome text='Content Player' />
      {/* table start */}
      <div className='flex flex-col'>
        {/* table header */}
        <TableHeader />
        {/* table body */}
        <PlayerContent data={data.player} />
        {/* table footer */}
        <TableFooter />
      </div>
    </div>
  );
}

export default ContentPlayer;
