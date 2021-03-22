<template>
  <v-container>
    <v-toolbar flat>
      <v-toolbar-title>Sorting Categories</v-toolbar-title>
      <v-spacer />
      <v-btn large class="primary" @click="saveSortedCategories">Save </v-btn>
    </v-toolbar>
    <v-row class="mt-5">
      <v-col cols="12" md="8" class="mx-auto">
        <draggable
          class="list-group"
          tag="ul"
          v-model="list"
          v-bind="dragOptions"
          @start="isDragging = true"
          @end="isDragging = false"
        >
          <transition-group name="flip-list">
            <li
              class="list-group-item d-flex"
              v-for="element in list"
              :key="element.id"
            >
              <span>
                {{ element.name }}
              </span>
            </li>
          </transition-group>
        </draggable>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import draggable from "vuedraggable";

export default {
  name: "SortedCategories",
  components: {
    draggable,
  },

  data() {
    return {
      list: [],
    };
  },
  computed: {
    dragOptions() {
      return {
        animation: 0,
        group: "description",
        disabled: false,
        ghostClass: "ghost",
      };
    },
  },

  methods: {
    async getMenuDispaly() {
      const res = await this.axios.get("menu_display");
      const { data } = res.data;
      const { categories } = data;
      if (categories) {
        this.list = categories.map((category) => ({
          id: category.category_id,
          name: category.name,
        }));
      }
      console.log(categories);
    },
    getCategories() {
      this.axios.get("/categories").then((res) => {
        const { data } = res.data;
        this.list = data.map((el) => ({
          id: el.id,
          name: el.name,
        }));
      });
    },
    saveSortedCategories() {
      const formData = { categories: [] };
      formData.categories = this.list.map((el) => ({
        category_id: el.id,
        name: el.name,
        children: [],
      }));
      this.axios.put("/menu_display", formData).then((res) => {
        console.log(res);
      });
    },
  },
  watch: {
    $route: {
      handler() {
        this.getCategories();
        this.getMenuDispaly();
      },
      immediate: true,
    },
  },
};
</script>

<style scoped>
.button {
  margin-top: 35px;
}
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.list-group {
  min-height: 20px;
}
.list-group-item {
  cursor: move;
}
.list-group-item i {
  cursor: pointer;
}
ul {
  list-style: none;
  color: #fff;
  font-size: 18px;
  text-transform: capitalize;
  position: relative;
}
li {
  background-color: rgba(0, 0, 0, 0.5);
  margin-bottom: 4px;
  padding: 10px;
  border-radius: 10px;
  position: relative;
}
</style>
