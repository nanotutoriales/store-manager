<template>
  <v-layout row wrap>
    <v-flex xs3 class="pa-2">
      <v-form v-model="valid" lazy-validation>
        <v-select
          v-model="storeId"
          v-validate="'required'"
          data-vv-name="storeId"
          item-text="name"
          item-value="id"
          :data-vv-as="$t('order.store').toLowerCase()"
          :items="stores"
          :label="$t('order.store')"
          :error-messages="errors.first('storeId')"
        ></v-select>
        <v-menu
          ref="menu"
          v-model="menu"
          :nudge-right="40"
          lazy
          transition="scale-transition"
          offset-y
          full-width
          min-width="290px"
        >
          <v-text-field
            readonly
            slot="activator"
            v-model="date"
            v-validate="'required'"
            data-vv-name="date"
            :data-vv-as="$t('order.date').toLowerCase()"
            :label="$t('order.date')"
            :error-messages="errors.first('date')"
          ></v-text-field>
          <v-date-picker
            scrollable
            v-model="date"
            locale="es-MX"
            @input="menu = false"
          >
          </v-date-picker>
        </v-menu>
        <v-btn
          right
          color="primary"
          :disabled="!valid"
          @click="submit"
        >
          {{ $t('label.filter') }}
        </v-btn>
      </v-form>
    </v-flex>
    <v-flex xs9 class="pa-2">
      <v-list two-line>
        <v-alert
          :value="true"
          type="info"
          v-if="orders.length == 0"
        >
          {{ $t('alert.empty') }}
        </v-alert>
        <v-list-tile
          v-for="order in orders"
          :key="order.id"
          @click="editOrder(order.id)"
        >
          <v-list-tile-action>
            <v-icon>star</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ order.referenceNumber }}</v-list-tile-title>
            <v-list-tile-sub-title>{{ order.total | currency }}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-flex>
  </v-layout>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';

  export default {
    name: 'OrderList',
    data () {
      return {
        valid: false,
        menu: false,
        storeId: null,
        date: null,
        stores: [],
        orders: []
      }
    },
    watch: {
      storeId (value) {
        this.setOrderParam({
          param: 'filter[where][storeId]',
          value: value
        });

        this.submit();
      },
      date (value) {
        this.setOrderParam({
          param: 'filter[where][date]',
          value: value
        });

        this.submit();
      }
    },
    computed: {
      ...mapGetters([
        'getOrderParams',
        'getOrderParam',
        'getStoreId'
      ])
    },
    created () {
      let storeId = this.getOrderParam('filter[where][storeId]');
      let date = this.getOrderParam('filter[where][date]');

      if (storeId) {
        this.storeId = parseInt(storeId);
      } else {
        this.storeId = this.getStoreId;
      }

      if (date) {
        this.date = date;
      }

      this.getStores();
    },
    methods: {
      ...mapActions([
        'setOrderParam'
      ]),
      getStores () {
        let self = this;

        this.$axios.get('/stores')
        .then(function (response) {
          self.stores = response.data;
        })
        .catch(function (error) {
          self.stores = [];
        });
      },
      getOrders () {
        let self = this;

        this.$axios.get('/orders', {
          params: this.getOrderParams
        })
        .then(function (response) {
          self.orders = response.data;
        })
        .catch(function (error) {
          self.orders = [];
        });
      },
      submit () {
        let self = this;

        this.$validator.validate().then(function (valid) {
          if (valid) {
            self.getOrders();
          }
        });
      },
      editOrder: function (orderId) {
        this.$router.push({ path: `/orders/${orderId}` });
      }
    }
  };
</script>
