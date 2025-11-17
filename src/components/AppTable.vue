<template>
  <section
    :class="[
      'w-full bg-white table-component relative overflow-visible',
      { 'shadow-sm rounded-lg': showOutline },
      sectionStyle,
    ]"
  >
    <slot name="header">
      <header
        v-if="title"
        class="flex items-center justify-between px-5.5 py-3"
      >
        <h4 class="font-medium text-lg text-gray-600">
          {{ title }}
          <span
            v-if="showTotal"
            class="bg-gray-100 text-gray-600 font-normal px-3 rounded-full text-xs"
            >{{ totalItems }} {{ tableName }}</span
          >
        </h4>
        <slot name="action-button">
          <app-button
            v-if="showAddBtn"
            :label="addBtnText"
            @click="() => $emit('add-btn-click')"
          >
            <template #leadingSlot>
              <app-icon
                class="text-center cursor-pointer"
                icon="plus-icon"
                size="20"
                v-bind="props"
              ></app-icon>
            </template>
          </app-button>
        </slot>
      </header>
    </slot>
    <article :class="wrapperStyle">
      <div class="overflow-x-auto overflow-y-visible">
        <table
          :class="[
            setTableStyle,
            'text-sm text-gray-600 divide-y divide-gray-200',
          ]"
          aria-label="Data Table"
        >
          <thead>
            <!-- double header -->
            <tr v-if="doubleHeader">
              <th
                v-for="(header, index) in topHeaders"
                :key="header.key"
                :aria-label="header.label"
                :class="[
                  'bg-gray-100 font-normal text-gray-600 text-center border-b border-t border-gray-200 last:border-none px-6 py-3 ',
                  typeof headerStyles === 'function'
                    ? headerStyles(header)
                    : headerStyles,
                ]"
                :colspan="
                  header.colspan
                    ? header.colspan
                    : index === topHeaders.length - 1
                    ? 2
                    : 1
                "
                :rowspan="header?.rowspan"
                scope="col"
              >
                {{ header.label }}
                <span v-show="currency && header.type === 'currency'"
                  >({{ currency }})</span
                >
              </th>
            </tr>
            <!-- regular header -->
            <tr :class="[trStyle, 'bg-gray-100 divide-gray-200']">
              <th v-if="showCheckbox" class="px-3 py-3 text-center" scope="col">
                <input
                  id="selectAll"
                  type="checkbox"
                  @change="handleSelectAll"
                />
              </th>
              <th
                v-for="header in headers"
                :key="header.key"
                :aria-label="header.label"
                :class="[
                  ' font-normal text-gray-600 text-left px-6 py-3',
                  getClasses(header.type),
                  typeof headerStyles === 'function'
                    ? headerStyles(header)
                    : headerStyles,
                ]"
                :style="{ width: columnWidths[header.key] || 'auto' }"
                scope="col"
              >
                <div class="flex items-center">
                  {{ header.label }}
                  <span v-show="currency && header.type === 'currency'"
                    >({{ currency }})</span
                  >
                  <app-icon
                    v-if="header.sortable"
                    :class="[
                      'text-center cursor-pointer ml-1',
                      {
                        'rotate-180': header.sortDirection === 'desc',
                      },
                    ]"
                    icon="sort-icon"
                    size="20"
                    @click="$emit('sort', header.key, header.sortDirection)"
                  ></app-icon>
                </div>
              </th>
              <th v-if="showMenu" scope="col"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <template v-for="(item, itemIndex) in items" :key="itemIndex">
              <tr
                :class="[
                  trStyle,
                  'hover:bg-[#F9FAFB] hover:cursor-pointer divide-gray-200',
                ]"
              >
                <td v-if="showCheckbox" class="px-3 py-3 text-center">
                  <input
                    :id="`row_${itemIndex}`"
                    v-model="selectedRows"
                    :value="item"
                    type="checkbox"
                  />
                </td>
                <td
                  v-for="header in headers"
                  :key="header.key"
                  :class="[
                    'font-normal  px-3 py-3',
                    getClasses(header.type),
                    typeof rowStyles === 'function'
                      ? rowStyles(item, itemIndex, header.key)
                      : rowStyles,
                  ]"
                  :style="{ width: columnWidths[header.key] || 'auto' }"
                  @click="
                    $emit('item-click', { ...item, option: 'View', itemIndex })
                  "
                >
                  <slot
                    :index="itemIndex"
                    :item="{ item, index: itemIndex }"
                    :name="header.key"
                  >
                    <!-- If this column is a 'list' type, display the first item plus +X,
and show the rest on hover in a popover. -->
                    <div
                      v-if="header.type === 'list'"
                      class="relative inline-block"
                      @mouseenter="showList(itemIndex)"
                      @mouseleave="hideList()"
                      @click="popOverToggle($event, itemIndex)"
                    >
                      <!-- Display the first item or a placeholder if empty -->
                      <p class="flex">
                        <!-- Show the first list item or "-" if none -->
                        {{ item[header.key]?.[0] || "-" }}

                        <!-- If more than 1 item, display +X -->
                        <span
                          v-if="item[header.key]?.length > 1"
                          class="bg-[#F3F3F8] rounded-xl text-[0.6875rem] ml-1 flex items-center justify-center px-2 py-0.5"
                        >
                          +{{ item[header.key].length - 1 }}
                        </span>
                      </p>

                      <!-- Popover: show all items except the first one -->
                      <Popover :ref="`popover_${itemIndex}`">
                        <div
                          v-if="item[header.key].length > 1"
                          class=" w-max max-w-xs flex flex-col justify-between items-start text-sm  max-h-64"
                        >
                          <p
                            v-for="(listItem, i) in item[header.key]"
                            :key="i"
                            class="cursor-pointer w-full text-no-wrap px-4 py-2 hover:bg-gray-50 transition-colors ease-in-out duration-300 text-sm first:rounded-t-lg last:rounded-b-lg"
                          >
                            {{ listItem }}
                          </p>
                        </div>
                      </Popover>
                    </div>

                    <!-- Otherwise, display a normal cell using formatValue -->
                    <p
                      v-else-if="typeof item[header.key] === 'object'"
                      class="flex flex-col px-3"
                    >
                      <span>{{ item[header.key]?.name || "" }}</span>
                      <span class="text-[#8F95B2]">{{
                        formatDate(item[header.key]?.duration) || "-"
                      }}</span>
                    </p>
                    <a
                      v-else-if="header.type === 'file'"
                      :href="item[header.key]"
                      :title="item[header.key]"
                      class="text-blue-500 hover:text-blue-600 cursor-pointer hover:underline"
                      target="_blank"
                      >{{ item[header.key]?.slice(0, 50) }}</a
                    >
                    <p v-else :class="['px-3 rounded-full inline-block']">
                      {{ formatValue(item[header.key], header.type) }}
                    </p>
                  </slot>
                </td>
                <!-- menu -->
                <td
                  v-if="showMenu"
                  :class="['relative z-999  px-3 py-3', menuStyles]"
                >
                  <slot :item="{ ...item, index: itemIndex }" name="menu">
                    <i
                      class="pi pi-ellipsis-v hidden md:block w-4 h-4 cursor-pointer"
                      @click="toggleMenu($event, item)"
                    ></i>
                  </slot>
                </td>
              </tr>
            </template>
            <tr v-if="items.length <= 0">
              <td
                :colspan="headers.length + (showMenu ? 1 : 0)"
                class="text-center text-[#667085] py-4 h-90"
              >
                <div
                  class="h-12 w-12 rounded-full mx-auto bg-gray-100 flex items-center justify-center"
                >
                  <p
                    class="h-10 w-10 rounded-full mx-auto bg-primary-100 text-primary-600 flex items-center justify-center"
                  >
                    <i class="pi pi-table"></i>
                  </p>
                </div>
                <p class="font-semibold">{{ emptyStateHeader }}</p>
                <p class="max-w-lg mx-auto">
                  {{ emptyStateDescription }}
                </p>
                <button
                  v-if="showEmptyStateAction"
                  class="text-primary-600 mt-3 cursor-pointer font-medium text-sm hover:text-primary-500"
                  @click="$emit('empty-state-action')"
                >
                  {{ emptyStateActionText }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Updated Pagination Footer with 5 page limit and ellipsis -->
      <footer
        v-if="showPagination && totalPages > 1"
        class="px-4 py-2 flex border-t border-gray-200 items-center"
      >
        <!-- Showing X to Y of Z entries -->
        <div class="font-normal text-base text-[#667085]">
          Showing {{ from }} to {{ to }} of {{ totalItems }} entries
        </div>

        <!-- Page controls -->
        <div class="space-x-2 flex items-center ml-auto">
          <button
            :disabled="currentPage === 1"
            class="py-2 disabled:opacity-50 disabled:cursor-default cursor-pointer"
            @click="goToPage(1)"
          >
            <i class="pi pi-angle-double-left"></i>
          </button>

          <button
            :disabled="currentPage === 1"
            class="disabled:opacity-50 disabled:cursor-default cursor-pointer"
            @click="goToPage(currentPage - 1)"
          >
            <i class="pi pi-angle-left"></i>
          </button>

          <!-- Page numbers with ellipsis logic -->
          <template v-for="item in paginationItems" :key="item.key">
            <!-- Ellipsis -->
            <span
              v-if="item.type === 'ellipsis'"
              class="px-2 py-2 text-[#667085] text-sm"
            >
              ...
            </span>

            <!-- Page button -->
            <button
              v-else
              :class="[
                'px-4 py-2 rounded-lg border border-none text-sm font-normal cursor-pointer ',
                currentPage === item.page
                  ? 'bg-blue-500 text-white'
                  : 'text-[#667085] hover:text-[#083C5A]',
              ]"
              @click="goToPage(item.page)"
            >
              {{ item.page }}
            </button>
          </template>

          <button
            :disabled="currentPage === totalPages"
            class="py-1 disabled:opacity-50 disabled:cursor-default cursor-pointer"
            @click="goToPage(currentPage + 1)"
          >
            <i class="pi pi-angle-right"></i>
          </button>
          <button
            :disabled="currentPage === totalPages"
            class="py-2 disabled:cursor-default disabled:opacity-50"
            @click="goToPage(totalPages)"
          >
            <i class="pi pi-angle-double-right"></i>
          </button>
        </div>
      </footer>
    </article>
    <drop-down-menu
      id="tableMenu"
      ref="menu"
      :model="dropdownOptions"
      :popup="true"
    >
      <template #item="slotProps">
        <p
          class="cursor-pointer hover:text-primary pl-2"
          @click="handleMenuClick(slotProps.item)"
        >
          {{ slotProps.item.label }}
        </p>
      </template>
    </drop-down-menu>
  </section>
</template>

<script>
import { defineComponent } from "vue";
import { formatDate } from "../utils/helpers.ts";
import { Menu, Popover } from "primevue";

export default defineComponent({
  name: "AppDataTable",
  components: { DropDownMenu: Menu, Popover },
  emits: [
    "menu-click",
    "item-click",
    "add-btn-click",
    "selection-change",
    "page-changed",
    "sort",
    "empty-state-action",
  ],
  props: {
    tableName: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    headers: {
      type: Array,
      default: () => [],
    },
    items: {
      type: Array,
      default: () => [],
    },
    showCurrency: {
      type: Boolean,
      default: false,
    },
    showAddBtn: {
      type: Boolean,
      default: false,
    },
    addBtnText: {
      type: String,
      default: "",
    },
    currency: {
      type: String,
      default: "USD",
    },
    setTableStyle: {
      type: String,
      default: "min-w-full",
    },
    showTotal: {
      type: Boolean,
      default: false,
    },
    isShowMore: {
      type: Boolean,
      default: false,
    },

    showActions: {
      type: Boolean,
      default: false,
    },

    doubleHeader: {
      type: Boolean,
      default: false,
    },
    topHeaders: {
      type: Array,
      default: () => [],
    },

    rowStyles: {
      type: [String, Function],
      default: "",
    },

    classStyle: {
      type: String,
      default: "",
    },

    columnWidths: {
      type: Object,
      default: () => ({}),
    },
    headerStyles: {
      type: [String, Function],
      default: "",
    },
    showPagination: {
      type: Boolean,
      default: false,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    pageSize: {
      type: Number,
      default: 10,
    },
    totalItems: {
      type: Number,
      default: 0,
    },
    showMenu: {
      type: Boolean,
      default: false,
    },
    dropdownOptions: {
      type: Array,
      default: () => [
        { key: "view", label: "View User" },
        { key: "delete", label: "Delete" },
      ],
    },
    showOutline: {
      type: Boolean,
      default: true,
    },
    sectionStyle: {
      type: String,
      default: "",
    },
    trStyle: {
      type: String,
      default: "",
    },
    showCheckbox: {
      type: Boolean,
      default: false,
    },
    wrapperStyle: {
      type: String,
      default: "overflow-hidden ",
    },
    emptyStateHeader: {
      type: String,
      default: "No data available",
    },
    emptyStateDescription: {
      type: String,
      default: "You'll see all data here once it's available",
    },
    emptyStateIcon: {
      type: String,
      default: "empty-data-icon",
    },
    showEmptyStateAction: {
      type: Boolean,
      default: false,
    },
    emptyStateActionText: {
      type: String,
      default: "Refresh",
    },
    showGroupedTableData: {
      type: Boolean,
      default: false,
    },
    menuStyles: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      show: null,
      selectedRows: [],
      selectedItem: null,
    };
  },
  computed: {
    paginationItems() {
      const maxPages = 5;
      const items = [];

      if (this.totalPages <= maxPages) {
        for (let i = 1; i <= this.totalPages; i++) {
          items.push({
            type: "page",
            page: i,
            key: `page-${i}`,
          });
        }
      } else if (this.currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          items.push({
            type: "page",
            page: i,
            key: `page-${i}`,
          });
        }
        items.push({
          type: "ellipsis",
          key: "ellipsis-end",
        });
        items.push({
          type: "page",
          page: this.totalPages,
          key: `page-${this.totalPages}`,
        });
      } else if (this.currentPage >= this.totalPages - 2) {
        items.push({
          type: "page",
          page: 1,
          key: "page-1",
        });
        items.push({
          type: "ellipsis",
          key: "ellipsis-start",
        });
        for (let i = this.totalPages - 3; i <= this.totalPages; i++) {
          items.push({
            type: "page",
            page: i,
            key: `page-${i}`,
          });
        }
      } else {
        items.push({
          type: "page",
          page: 1,
          key: "page-1",
        });
        items.push({
          type: "ellipsis",
          key: "ellipsis-start",
        });
        items.push({
          type: "page",
          page: this.currentPage - 1,
          key: `page-${this.currentPage - 1}`,
        });
        items.push({
          type: "page",
          page: this.currentPage,
          key: `page-${this.currentPage}`,
        });
        items.push({
          type: "page",
          page: this.currentPage + 1,
          key: `page-${this.currentPage + 1}`,
        });
        items.push({
          type: "ellipsis",
          key: "ellipsis-end",
        });
        items.push({
          type: "page",
          page: this.totalPages,
          key: `page-${this.totalPages}`,
        });
      }

      return items;
    },
    totalPages() {
      if (!this.showPagination) return 1;
      return Math.ceil(this.totalItems / this.pageSize);
    },
    from() {
      if (!this.items.length) return 0;
      return (this.currentPage - 1) * this.pageSize + 1;
    },
    to() {
      return (this.currentPage - 1) * this.pageSize + this.items.length;
    },
    getClasses() {
      return (type) => {
        return type === "currency" ? "text-right" : "text-left";
      };
    },
  },
  watch: {
    selectedRows: {
      deep: true,
      handler(newVal) {
        this.$emit("selection-change", newVal);
      },
    },
  },

  methods: {
    handleMenuClick(event) {
      this.$emit("menu-click", { event, item: this.selectedItem });
    },
    popOverToggle(event, itemIndex) {
      this.$refs[`popover_${itemIndex}`][0].toggle(event);
    },
    formatDate,
    toggleMenu(event, item) {
      this.selectedItem = item;
      this.$refs.menu?.toggle(event);
    },
    handleSelectAll(event) {
      if (event.target.checked) {
        this.selectedRows = this.items.map((item) => item);
      } else {
        this.selectedRows = [];
      }
    },
    showList(index) {
      this.show = index;
    },
    hideList() {
      this.show = null;
    },
    goToPage(page) {
      if (page < 1 || page > this.totalPages) return;
      this.$emit("page-changed", page);
    },
    formatValue(value, type) {
      const defineType = [null, undefined, 0, "0"];
      const checkValue = defineType.includes(value) ? "" : value;
      switch (type) {
        case "date":
          return checkValue ? this.formatDate(checkValue) : "-";
        case "list":
          return Array.isArray(checkValue) ? checkValue.join(", ") : "-";
        case "boolean":
          return checkValue === true ? "Yes" : "No";
        default:
          return checkValue || "-";
      }
    },
  },
});
</script>
<style scoped>
input[type="checkbox"] {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 1.25rem;
  height: 1.25rem;
  border: 1px solid #d0d5dd;
  border-radius: 6px;
  outline: none;
  transition: all 0.3s;
  position: relative;
  cursor: pointer;
}

input[type="checkbox"]:checked {
  background: #a8d7f3;
  border-color: #a8d7f3;
}

input[type="checkbox"]:checked::before {
  content: "✔";
  color: #0b5887;
  font-size: 12px;
  font-weight: bold;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

input[type="checkbox"]:disabled {
  color: #475467;
  background: #f2f4f7;
  cursor: default;
}
</style>
