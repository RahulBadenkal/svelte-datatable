<!-- Typescript -->
<script lang="ts">
  // Directives
  import {clickOutside} from '../directives/clickOutside';
  import { HTMLElementDimension, getDimension } from '../directives/getDimension'
import { isEmpty } from '../lib/utils';

  // Input data
  let data = [
    { col1: "cell (1, 1)", col2: "cell (1, 2)", col3: "cell (1, 3)" },
    { col1: "cell (2, 1)", col2: "cell (2, 2)", col3: "cell (2, 3)" },
    { col1: "cell (3, 1)", col2: "cell (3, 2)", col3: "cell (3, 3)" },
  ];
  let columns = [
    { key: "col1", name: "Column1" },
    { key: "col2", name: "Column2" },
    { key: "col3", name: "Column3" },
  ];


  // Props
  let colProps: {[key in string]: {
    hover: boolean; optionsOpen: boolean; dimension: HTMLElementDimension
  }} = columns.reduce((map, col) => {
    map[col.key] = {}
    return map
  }, {})
  const headerProps: {dimension?: HTMLElementDimension, lastSort?: { key: string; order: number }} = { }


  // Methods
  const sortCol = (colKey: string, order:number) => {
    data = [...data].sort((a, b) => {
      const val1 = (a[colKey] || "").toString()
      const val2 = (b[colKey] || "").toString() 
      return order * val1.localeCompare(val2)
    })
    headerProps.lastSort = { key: colKey, order }
  }

</script>

<!-- Template -->
<div class="h-screen flex justify-center items-center">
  <table class="excel-table">
    <thead>
      <tr use:getDimension on:sizeChanged={(e) => headerProps.dimension = e.detail}>
        {#each columns as col}
          <th
            on:mouseenter="{e => colProps[col.key].hover = true}"
            on:mouseleave="{e => colProps[col.key].hover = false}"
            class:show-header-options-btn="{colProps[col.key].hover || headerProps.lastSort?.key === col.key}"
            class:options-open="{colProps[col.key].optionsOpen}"
          >
            <div class="flex gap-4">
              <span>{col.name}</span>
              <button class="bg-gray-300 header-options-btn" on:click={e => colProps[col.key].optionsOpen = !colProps[col.key].optionsOpen}>Opt{headerProps.lastSort?.key === col.key ? (headerProps.lastSort.order === 1 ? '(A)' : '(D)') : ''}</button>
              {#if colProps[col.key].optionsOpen}
                <div class="header-options" style="top: {headerProps.dimension.offsetHeight}px" use:clickOutside on:outClick={(e) => { colProps[col.key].optionsOpen = false; e.detail.stopPropagation() }}>
                  <ul>
                    <li class="mb-4"><button class="bg-gray-300" class:bg-red-300="{headerProps.lastSort?.key === col.key && headerProps.lastSort?.order === 1}" on:click={e => sortCol(col.key, 1)}>Sort ascending</button></li>
                    <li><button class="bg-gray-300" class:bg-red-300="{headerProps.lastSort?.key === col.key && headerProps.lastSort?.order === -1}" on:click={e => sortCol(col.key, -1)}>Sort descending</button></li>
                  </ul>
                </div>
              {/if}
            </div>
          </th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each data as row}
        <tr>
          {#each columns as col}
            <td>{row[col.key]}</td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<!-- Styles -->
<style>
  .excel-table {
  }
  .excel-table th, td {
    border: 1px solid gray;
  }
.excel-table th {
  position: relative;
}
  .excel-table th .header-options-btn {
    visibility: hidden;
  }
  .excel-table th.show-header-options-btn .header-options-btn {
    visibility: visible;
  }
  .excel-table th.options-open .header-options-btn {
    visibility: visible;
  }
  .excel-table .header-options {
    right: 0;
    position: absolute;
    background-color: white;
    max-width: 150px;
  }
  


</style>
