import { TBody, THead, Table, Td, Th, Tr } from '@ichiba/ichiba-core-ui';

const UsersList = () => {
  return (
    <Table>
      <THead>
        <Tr>
          <Th>#</Th>
          <Th>Name</Th>
          <Th>Gender</Th>
          <Th>Age</Th>
        </Tr>
      </THead>
      <TBody>
        <Tr borderBottom>
          <Td>1</Td>
          <Td>Lorem ipsum, dolor sit amet consectetur adipisicing elit.</Td>
          <Td>Lorem ipsum, dolor sit amet consectetur adipisicing elit.</Td>
          <Td>Lorem ipsum, dolor sit amet consectetur adipisicing elit.</Td>
        </Tr>
      </TBody>
    </Table>
  );
};

export default UsersList;
