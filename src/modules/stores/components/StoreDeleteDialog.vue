<template>
  <v-dialog
    v-model="dialog"
    width="500"
  >
    <v-btn
      color="error"
      slot="activator"
      dark
      fab
      bottom
      right
      fixed
    >
      <v-icon>delete</v-icon>
    </v-btn>
    <v-card>
      <v-card-title
        class="headline"
      >
        {{ $t('dialog.delete.title', { entity: $tc('entities.store', 1) }) }}
      </v-card-title>
      <v-card-text>
        {{ $t('dialog.delete.message', { entity: $tc('entities.store', 1) }) }}
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          flat
          @click="dialog = false"
        >
          {{ $t('label.cancel') }}
        </v-btn>
        <v-btn
          color="primary"
          flat
          @click="deleteStore"
        >
          {{ $t('label.confirm') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'StoreDeleteDialog',
  data () {
    return {
      dialog: false
    }
  },
  props: [
    'storeId'
  ],
  methods: {
    ...mapActions([
      'displaySnackbar'
    ]),
    getStoreId () {
      return this.storeId;
    },
    deleteStore () {
      let self = this;
      let storeId = this.getStoreId();

      this.$axios.delete(`/stores/${storeId}`)
      .then(function (response) {
        self.dialog = false;
        self.storeList();
        self.displaySnackbar({
          color: 'success',
          message: self.$t('notification.success.delete')
        });
      })
      .catch(function (error) {
        self.dialog = false;
        self.displaySnackbar({
          color: 'error',
          message: self.$t('notification.failure.delete')
        });
      });
    },
    storeList () {
      this.$router.push({ path: '/stores' });
    }
  }
};
</script>
