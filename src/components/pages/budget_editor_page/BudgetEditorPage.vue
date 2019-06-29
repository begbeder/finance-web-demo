<template src="./BudgetEditorPage.pug" lang="pug"></template>

<script lang="ts">
  import { Component, Vue } from "vue-property-decorator";
  import { Repositories, BudgetItemTypes, BudgetItemFinanceTypes } from "../../../core";
  import {
    ITreeItem,
    ITreeNode,
    generateTreeBudgetItems,
    removeObjectProps,
  } from "../../../support";

  import BudgetItemForm from "../../budget_item_form/BudgetItemForm.vue";

  export interface ITreeNodesState {
    [key: number]: boolean;
  }

  /**
   * Функция для сохранения состояния узлов дерева для последующего восстановления.
   */
  export function saveTreeNodesState(nodes: ITreeNode[] | null) {
    let list: ITreeNodesState = {};

    if (nodes) {
      nodes.forEach((node: ITreeNode) => {
        list[node.data.id] = node.expanded;

        if (node.childNodes && node.childNodes.length) {
          list = Object.assign({}, list, saveTreeNodesState(node.childNodes));
        }
      });

      return list;
    }

    return null;
  }

  /**
   * Восстанавливает состояние дерева (раскрытие/закрытие элементов вложенности) до обновления.
   * @param {ITreeNode | null} store
   * @param {ITreeNodesState | null} listNodesState
   */
  function revertBeforeUpdatedTreeNodesState(store: ITreeNode | null, listNodesState: ITreeNodesState | null) {
    if (store && listNodesState) {
      store.childNodes.forEach((node: ITreeNode) => {
        if (listNodesState && listNodesState.hasOwnProperty(node.data.id)) {
          node.expanded = listNodesState[node.data.id];
        }

        if (node.childNodes && node.childNodes.length) {
          revertBeforeUpdatedTreeNodesState(node, listNodesState);
        }
      });
    }
  }

  /**
   * Класс компонента страницы редактирования статей доходов и расходов.
   */
  @Component({
    components: {
      "budget-item-form": BudgetItemForm,
    },
  })
  export default class BudgetEditorPage extends Vue {

    /**
     * Сгенерированное дерево статей бюджета
     */
    public budgetItemsTree: ITreeItem[] = [];

    /**
     * Флаг видимости окна редактирования статьи
     */
    public budgetItemEditorVisible: boolean = false;

    /**
     * Данные для редактирования статьи
     */
    public budgetItemEditorForm: ITreeItem = {
      id: 0,
      title: "",
      type: BudgetItemTypes.Editable,
      budgetItemFinanceType: BudgetItemFinanceTypes.Fixed,
      formula: "",
      color: null,
      parentId: null,
      sort: 1,
      children: null,
    };

    /**
     * Флаг видимости окна создания статьи
     */
    public newBudgetItemEditorVisible: boolean = false;

    /**
     * Идентификатор статьи, которую требуется удалить.
     */
    public itemDeletedId: number | null = null;

    /**
     * Флаг видимости окна подтверждения удаления статьи.
     */
    public confirmDialogIsVisible: boolean = false;

    /**
     * Идентификатор перемещенного элемента (идентификатор сущности).
     */
    public draggingNodeId: number | null = null;

    public rootStore: ITreeNode | null = null;

    public treeNodesState: ITreeNodesState | null = null;

    /**
     * Отрабатывает событие изменения положения статьи в дереве.
     * @param draggingNode
     * @param dropNode
     * @param dropType
     * @param event
     */
    public async handleDrop(draggingNode: ITreeNode, dropNode: ITreeNode, dropType: string, event: Event) {
      try {
        // Случай, когда изменилось положение узла относительно родителя или соседних узлов.
        if (dropType === "after" || dropType === "before") {
          const updatedNodes = this.getUpdatedNodes(dropNode.parent.childNodes, dropNode.data.parentId);

          await Repositories.budgetItem.updateList(updatedNodes);

        } else if (dropType === "inner") {
          // Случай, когда элемент помещен внутрь листа, возращается родитель.
          const updatedChildNodes = this.getUpdatedNodes(dropNode.childNodes, dropNode.data.id);
          const updatedSelfNode = this.getSelfNode(dropNode);

          updatedChildNodes.push(updatedSelfNode);

          await Repositories.budgetItem.updateList(updatedChildNodes);
        }

        if (dropType !== "none") {
          // Сохраняем ссылку на модель дерева до обновления из апи.
          this.updateTreeState(dropNode);

          await this.updateBudgetTree();

          // После перерисовки компонента, восстанавливает состояние компонента.
          this.$nextTick(() => {
            revertBeforeUpdatedTreeNodesState(this.rootStore, this.treeNodesState);
          });
        }

        // Вызывается для подсвечивания перемещенного элемента.
        if (this.draggingNodeId) {
          const draggingNodeConst = document.getElementById(String(this.draggingNodeId));
          if (draggingNodeConst) {
            const parentElement = draggingNodeConst.parentElement;
            if (parentElement) {
              parentElement.classList.add("el-tree-node__content_active");

              setTimeout(() => {
                parentElement.classList.remove("el-tree-node__content_active");
              }, 1000);
            }
          }

          this.draggingNodeId = null;
        }

        this.$store.commit("addNotification", {
          title: "",
          message: "Изменения успешно сохранены.",
        });
      } catch (error) {
        console.log(error);

        this.$store.commit("addNotificationError", error);
      }
    }

    /**
     * Вызывается когда закончено перетаскивание элемента.
     * Подсвечивает перетащенную строку в течении 1000 мс.
     */
    public handleDragEnd(draggingNode: ITreeNode) {
      this.draggingNodeId = draggingNode.data.id;
    }

    /**
     * Обрабатывает нажатие на элемент дерева.
     */
    public handleNodeClick(clickedNode: ITreeNode, node: ITreeNode) {
      this.updateTreeState(node);
    }

    /**
     * Обновляет ссылку на текущее состояние дерева статей.
     */
    public updateTreeState(node: ITreeNode) {
      // Сохраняем ссылку на модель дерева до обновления из апи.
      if (node && node.store) {
        const root = node.store.root;

        this.rootStore = root;

        this.treeNodesState = saveTreeNodesState(root.childNodes);
      }
    }

    /**
     * Возвращает массив обновленных элементов с того же уровня, где находится элемент.
     * @param {ITreeNode[]} sortedNodes
     * @param {number} parentId
     */
    public getUpdatedNodes(nodes: ITreeNode[], parentId: number | null) {
      return nodes.map((node: ITreeNode, index: number) => {
        const data = Object.assign({}, node.data, { sort: index + 1, parentId });

        if (data.children && !data.children.length) {
          data.type = BudgetItemTypes.Editable;
        }

        // Удаляем свойства, используемые для построения интерфейса
        removeObjectProps(data);

        return data;
      }) as ITreeItem[];
    }

    /**
     * Возвращает обновленный узел для сохраения в апи.
     */
    public getSelfNode(node: ITreeNode) {
      // Изменяем тип обновленного узла
      const data = Object.assign({}, node.data, { type: BudgetItemTypes.SubTotal });

      // Удаляем свойства, используемые для построения интерфейса
      removeObjectProps(data);

      return data as ITreeItem;
    }

    /**
     * Загружает список статей и обновляет дерево статей.
     */
    public async updateBudgetTree () {
      const budgetItems = await Repositories.budgetItem.getList();

      if (budgetItems.length) {
        this.budgetItemsTree = generateTreeBudgetItems(budgetItems);
      }
    }

    /**
     * Метод редактирования данных статьи
     * Устанавливает данные для редактирования
     * Открывает окно редактирования
     */
    public editItem(node: ITreeNode, data: ITreeItem) {
      // Сохраняем ссылку на модель дерева до обновления из апи.
      this.updateTreeState(node);

      this.budgetItemEditorForm = Object.assign({}, data);
      this.budgetItemEditorVisible = true;
    }

    /**
     * Сохраняет данные о статье в апи.
     */
    public async saveChange () {
      // Подобное решение использовано из-за того,
      // что обращение к componentWrap.$refs.budgetItemForm происходит через компонент обертку
      // с происвольным значением ref атрибута.
      const formComponent = (this.$refs.budgetItemEditorForm as any);

      formComponent.$refs.budgetItemForm
        .validate(async (valid: boolean) => {
        if (valid) {
          try {
            // Создаем объект для сохранения данных о статье.
            const data = Object.assign({}, formComponent.formDataLocal);

            // Удаляем свойства, используемые для построения интерфейса
            removeObjectProps(data);

            await Repositories.budgetItem.update(data.id, data);

            await this.updateBudgetTree();

            // После перерисовки компонента, восстанавливает состояние компонента.
            this.$nextTick(() => {
              revertBeforeUpdatedTreeNodesState(this.rootStore, this.treeNodesState);
            });

            this.budgetItemEditorVisible = false;

            this.$store.commit("addNotification", {
              title: "",
              message: "Изменения успешно сохранены.",
            });

          } catch (error) {
            console.log(error);
            this.$store.commit("addNotificationError", error);
          }
        } else {
          return false;
        }
      });
    }

    /**
     * Показывает окно подтверждения удаления.
     * Устанавливает идентификатор статьи для удаления.
     */
    public async showConfirmDialog (node: ITreeNode) {
      // Сохраняем ссылку на модель дерева до обновления из апи.
      this.updateTreeState(node);

      // Сохряем данные для обработки.
      this.itemDeletedId = node.data.id;

      this.confirmDialogIsVisible = true;
    }

    /**
     * Скрывает окно подтверждения удаления.
     * Сбрасывает идентификатор статьи.
     */
    public hideConfirmDialog () {
      this.itemDeletedId = null;

      this.confirmDialogIsVisible = false;
    }

    /**
     * Метод удаление статьи
     */
    public async removeItem() {
      try {
        const id = this.itemDeletedId;

        this.hideConfirmDialog();

        if (id) {
          await Repositories.budgetItem.delete(id);

          await this.updateBudgetTree();

          // После перерисовки компонента, восстанавливает состояние компонента.
          this.$nextTick(() => {
            revertBeforeUpdatedTreeNodesState(this.rootStore, this.treeNodesState);
          });

          this.$store.commit("addNotification", {
            title: "",
            message: "Статья успешно удалена.",
          });
        } else {
          // Генерируем ошибку если по какой-то причине не задан идентификатор статьи.
          this.$store.commit("addNotificationError", {
            response: {
              data: {
                message: "Идентификатор статьи не должен быть равен null.",
              },
            },
          });
        }
      } catch (error) {
        console.log(error);
        this.$store.commit("addNotificationError", error);
      }
    }

    /**
     * Устанавливает данные для создания новой статьи,
     * как дочерней, так и корневой.
     * Открывает окно редактирования данных.
     */
    public appendChild(node: ITreeNode | null, data: ITreeItem | null) {
      // Если null значит, создается корневой элемент.
      if (node) {
        this.updateTreeState(node);
      }

      this.budgetItemEditorForm = Object.assign({}, this.budgetItemEditorForm, {
        title: "",
        parentId: data ? data.id : null,
        type: BudgetItemTypes.Editable,
        budgetItemFinanceType: BudgetItemFinanceTypes.Variable,
        color: null,
        formula: "",
      });

      this.newBudgetItemEditorVisible = true;
    }

    /**
     * Метод создания новой статьи.
     * Проверяет форму,
     * Сохраняет данные в апи
     */
    public async createItem () {
      // Подобное решение использовано из-за того,
      // что обращение к componentWrap.$refs.budgetItemForm происходит через компонент обертку
      // с происвольным значением ref атрибута.
      const formComponent = (this.$refs.newBudgetItemEditorForm as any);

      formComponent.$refs.budgetItemForm.validate(async (valid: boolean) => {
        if (valid) {
          try {
            // Создаем объект для сохранения данных о статье.
            const data = Object.assign({}, formComponent.formDataLocal);

            // Удаляем свойства, используемые для построения интерфейса
            removeObjectProps(data, ["children", "label", "id", "parent"]);

            await Repositories.budgetItem.create(data);

            await this.updateBudgetTree();

            // После перерисовки компонента, восстанавливает состояние компонента.
            this.$nextTick(() => {
              revertBeforeUpdatedTreeNodesState(this.rootStore, this.treeNodesState);
            });

            this.newBudgetItemEditorVisible = false;

            this.$store.commit("addNotification", {
              title: "",
              message: "Статья успешно сохранена.",
            });

          } catch (error) {
            console.log(error);
            this.$store.commit("addNotificationError", error);
          }
        } else {
          return false;
        }
      });
    }

    public async created() {
      this.updateBudgetTree();
    }
  }
</script>

<style src="./BudgetEditorPage.scss" lang="scss"></style>