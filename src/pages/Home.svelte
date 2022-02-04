<!-- Typescript -->
<script lang="ts">
import Table from "../components/Table.svelte";
import Tbody from "../components/Tbody.svelte";
import Td from "../components/Td.svelte";
import Th from "../components/Th.svelte";
import Thead from "../components/Thead.svelte";
import Tr from "../components/Tr.svelte";


  /* Components */
  
  /* libs */

 
</script>

<!-- Template -->
<div class="h-screen flex justify-center items-center">
    <Table>
      <Thead>
        <Th>Column1</Th>
        <Th>Column2</Th>
        <Th>Column3</Th>
      </Thead>
      <Tbody>
        <Tr>
          <Td>
            <div class="hello">Cell (1, 1)</div>
          </Td>
          <Td>Cell (1, 2)</Td>
          <Td>Cell (1, 3)</Td>
        </Tr>
        <Tr>
          <Td>Cell (2, 1)</Td>
          <Td>Cell (2, 2)</Td>
          <Td>Cell (2, 3)</Td>
        </Tr>
        <Tr>
          <Td>Cell (3, 1)</Td>
          <Td>Cell (3, 2)</Td>
          <Td>Cell (3, 3)</Td>
        </Tr>
      </Tbody>
    </Table>
</div>


<!-- Styles -->
<style>

  .hello {
    color: red;
  }
 
</style>
