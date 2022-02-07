<!-- Typescript -->
<script lang="ts">
  // Directives
import { clickOutside } from "../directives/clickOutside";
  import {
    HTMLElementDimension,
    getDimension,
  } from "../directives/getDimension";
  import { isEmpty, isNullOrUndefined } from "../lib/utils";

  // Input data
  let data = [
    { col1: "cell (1, 1)", col2: "cell (1, 2)", col3: "cell (1, 3)", col4: 1 },
    { col1: "cell (2, 1)", col2: "cell (2, 2)", col3: "cell (2, 3)", col4: 2 },
    { col1: "cell (3, 1)", col2: "cell (3, 2)", col3: "cell (3, 3)", col4: 3 },
  ];
  let columns = [
    { key: "col1", name: "Column1", dtype: "string" },
    { key: "col2", name: "Column2", dtype: "string" },
    { key: "col3", name: "Column3", dtype: "string" },
    { key: "col4", name: "Column4", dtype: "number" },
  ];

  // Props
  let colProps: {
    [key in string]: {
      hover: boolean;
      dimension: HTMLElementDimension;
      searchText: string;
    };
  } = {}
  let headerProps: {
    dimension?: HTMLElementDimension;
    lastSort?: { key: string; order: number };
    optionsOpen?: { key: string; hover?: boolean };
    filterOptionsOpen?: { hover?: boolean };
    searchText?: string;
  } = {};
  let filteredData: {[key in string]: any}[] = data

  // Utils (Pure)
  const _showOptionsBtn = (headerProps, colProps, colKey: string) => {
    return (
      colProps[colKey].hover ||
      headerProps?.optionsOpen?.key === colKey ||
      headerProps.lastSort?.key === colKey
    );
  };
 
  // Initialisation (run on every input data change)
  colProps = columns.reduce((map, col) => {
    map[col.key] = {};
    return map;
  }, {}); 


  // Reactive statements
  $: showOptionsBtn = (colKey: string) => {
    // TODO: I know that this fires whenever headerProps/colProps changes, but how does it depend on colKey?
    return _showOptionsBtn(headerProps, colProps, colKey);
  };


  // Events
  const closeHeaderOptions = () => {
    headerProps.searchText = ""
    headerProps.optionsOpen = undefined
  }

  const openHeaderOptions = (colKey: string) => {
    headerProps.searchText = colProps[colKey].searchText
    headerProps.optionsOpen = { key: colKey }
  }

  const sortCol = (colKey: string, colDtype: string, order: number) => {
    filteredData = [...filteredData].sort((a, b) => {
      let [val1, val2] = [a[colKey], b[colKey]];

      // Empty checks
      if (isNullOrUndefined(val1) && isNullOrUndefined(val2)) return 0;
      if (isNullOrUndefined(val1)) return order * -1;
      if (isNullOrUndefined(val2)) return order * 1;

      if (colDtype === "number") {
        return order * (val1 - val2);
      } else {
        return order * val1.toString().localeCompare(val2.toString());
      }
    });
    headerProps.lastSort = { key: colKey, order };
  };

  const applyColSearchFilter = (colKey: string) => {
    // If current search text is same as old search text, continue
    const oldSearchText = isNullOrUndefined(colProps[colKey].searchText) ? "" : colProps[colKey].searchText
    const currSearchText = isNullOrUndefined(headerProps.searchText) ? "" : headerProps.searchText
    if (oldSearchText === currSearchText) return closeHeaderOptions()

    filteredData = data.filter((row) => {
      if (isNullOrUndefined(row[colKey])) return false
      return row[colKey].includes(headerProps.searchText)
    })  // Filter data
    colProps[colKey].searchText = headerProps.searchText  // Save search text
    closeHeaderOptions()
  }

</script>

<!-- Template -->
<div class="h-screen flex justify-center">
  <div class="mt-24">
    <table class="excel-table">
      <thead>
        <tr
          use:getDimension
          on:sizeChanged={(e) => (headerProps.dimension = e.detail)}
        >
          {#each columns as col}
            <th
              on:mouseenter={(e) => (colProps[col.key].hover = true)}
              on:mouseleave={(e) => (colProps[col.key].hover = false)}
              class:options-open={headerProps?.optionsOpen?.key === col.key}
            >
              <div class="flex gap-4">
                <span>{col.name}</span>
                <button
                  class="bg-gray-300 header-options-btn"
                  class:show={showOptionsBtn(col.key)}
                  on:click={(e) => openHeaderOptions(col.key)}
                  >Opt{headerProps.lastSort?.key === col.key
                    ? headerProps.lastSort.order === 1
                      ? "(A)"
                      : "(D)"
                    : ""}</button
                >
                {#if headerProps.optionsOpen?.key === col.key}
                  <div
                    class="header-options"
                    style="top: {headerProps.dimension.offsetHeight}px"
                    on:mouseenter={(e) => (headerProps.optionsOpen.hover = true)}
                    on:mouseleave={(e) => (headerProps.optionsOpen.hover = false)}
                    use:clickOutside
                    on:outClick={(e) => {
                      closeHeaderOptions()
                      e.detail.stopPropagation();
                    }}
                  >
                    <ul class="grid gap-y-4">
                      <li
                        class:bg-red-300={headerProps.lastSort?.key === col.key &&
                          headerProps.lastSort?.order === 1}
                      >
                        <button
                          class="bg-gray-300"
                          on:click={(e) => sortCol(col.key, col.dtype, 1)}
                          >Sort ascending</button
                        >
                      </li>
                      <li
                        class:bg-red-300={headerProps.lastSort?.key === col.key &&
                          headerProps.lastSort?.order === -1}
                      >
                        <button
                          class="bg-gray-300"
                          on:click={(e) => sortCol(col.key, col.dtype, -1)}
                          >Sort descending</button
                        >
                      </li>
                      <li
                        class="relative"
                        class:bg-red-300={headerProps.filterOptionsOpen}
                        on:mouseenter={(e) =>
                          (headerProps.filterOptionsOpen = { hover: true })}
                        on:mouseleave={(e) =>
                          (headerProps.filterOptionsOpen = undefined)}
                      >
                        <button class="bg-gray-300">
                          {#if col.dtype === "number"}
                            Number Filters
                          {:else}
                            Text Filters
                          {/if}
                        </button>
                        {#if headerProps.filterOptionsOpen?.hover}
                          <div class="filter-options">
                            <ul class="grid gap-y-4">
                              <li>Equals</li>
                              <li>Doesn't equals</li>
                              <li>Begins with</li>
                              <li>Begins with</li>
                              <li>Ends with</li>
                              <li>Contains</li>
                              <li>Doesn't contain</li>
                              <li>Custom filter</li>
                            </ul>
                          </div>
                        {/if}
                      </li>
                      <li>
                        <input placeholder="Search" bind:value={headerProps.searchText}/>
                        <div>
                          List here
                        </div>
                      </li>
                    </ul>
                    <div>
                      <button on:click={(e) => applyColSearchFilter(col.key)}>Ok</button>
                      <button on:click={(e) => closeHeaderOptions()}>Cancel</button>
                    </div>
                  </div>
                {/if}
              </div>
            </th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each filteredData as row}
          <tr>
            {#each columns as col}
              <td>{row[col.key]}</td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  
</div>

<!-- Styles -->
<style>
  .excel-table {
  }
  .excel-table th,
  td {
    border: 1px solid gray;
  }
  .excel-table th {
    position: relative;
  }
  .excel-table th .header-options-btn {
    visibility: hidden;
  }
  .excel-table th .header-options-btn.show {
    visibility: visible;
  }
  .excel-table .header-options {
    right: 0;
    position: absolute;
    background-color: white;
    width: 150px;
    border: 1px solid black;
  }

  .excel-table .filter-options {
    top: 0px;
    right: -151px;
    position: absolute;
    background-color: white;
    width: 150px;
    border: 1px solid black;
  }
</style>
