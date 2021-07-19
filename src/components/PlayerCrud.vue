<template>
  <v-data-table
    :headers="headers"
    :items="players"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Jogadores de RPG</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="700px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              Novo Jogador
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.id"
                      label="id"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="8">
                    <v-text-field
                      v-model="editedItem.name"
                      label="Nome"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.rpgSystem"
                      label="Sistema de RPG"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close"> Cancelar </v-btn>
              <v-btn color="blue darken-1" text @click="save"> Salvar </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
      <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize"> Reset </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import axios from "axios";
export default {
  name: "PlayerCrud",
  data: () => ({
    dialog: false,
    headers: [
      { text: "Id", value: "id" },
      { text: "Nome", value: "name" },
      { text: "Sistema de RPG", value: "rpgSystem" },
      { text: "Ações", value: "actions", sortable: false },
    ],
    players: [{ id: 0, name: "Luiz", rpgSystem: "Philipinas" }],
    editedId: -1,
    editedIndex: -1,
    editedItem: {
      id: 0,
      name: "",
      rpgSystem: "DnD 5e",
    },
    defaultItem: {
      id: 0,
      name: "",
      rpgSystem: "XPTO",
    },
  }),
  methods: {
    inicializa() {
      axios("http://localhost:3000/players")
        .then((response) => {
          this.players = response.data;
        })
        .catch((error) => console.log(error));
    },
    close() {
      this.dialog = false;
    },
    save() {
      if (this.editedId > -1) {
        //alteracao
        axios
          .put(
            "http://localhost:3000/players/" + this.editedId,
            this.editedItem
          )
          .then((response) => {
            console.log(response);
            Object.assign(this.players[this.editedIndex], this.editedItem);
            this.close();
          })
          .catch((error) => console.log(error));
          this.close();
      } else {
        //Inclusao
        axios
          .post("http://localhost:3000/players", this.editedItem)
          .then((response) => {
            console.log(response);
            this.players.push(this.editedItem);
            this.close();
          })
          .catch((error) => console.log(error));
      }
    },
    editItem(item) {
      this.editedId = item.id;
      this.editedIndex = this.players.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },
    deleteItem(item) {
      const index = this.players.indexOf(item);
      confirm("Deseja apagar este jogador?") &&
        axios
          .delete("http://localhost:3000/players/" + item.id)
          .then((response) => {
            console.log(response.data);
            this.players.splice(index, 1);
          })
          .catch((error) => console.log(error));
    },
  },
  computed: {
    formTitle() {
      return this.editedId === -1 ? "Novo Jogador" : "Editar Jogador";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.inicializa();
  },
};
</script>

<style scoped>
</style>