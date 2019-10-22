<template>
	<div>
		<div class="row">
			<div class="col-md-7">
				<div class="items">
					<input type="text" class="form-control" v-model="filter" placeholder="O que você está buscando?">
					<br/>
					<div class="list-group">
						<div class="list-group-item" v-for="item in filteredItems" v-bind:key="item.id">
							<div class="row">
								<div class="col-md-2">
									<span class="badge badge-info">{{ item.category}}</span>
								</div>
								<div class="col-md-5">
									<h5>{{ item.description }}</h5>
								</div>
								<div class="col-md-2 text-right">
									<h5>{{ formatMoney(item.price) }}</h5>
								</div>
								<div class="col-md-3 text-right">
									<button class="btn btn-outline-info btn-sm" v-on:click="addItem(item)">
										<span class="fa fa-plus"></span>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="order col-md-5">
				<div class="row">
					<div class="col-md-7">
						<h4>Pedido #{{ order.id }}</h4>
						<span>{{ order.date }}</span>
					</div>
					<div class="col-md-5 text-right">
						<h5>{{ formatMoney(order.total) }}</h5>
					</div>
				</div>
				<hr/>
				<div v-if="order.orderItems.length === 0" class="text-center">
					<div class="no-order-icon">
						<span class="fa fa-list fa-4x text-info"></span>
					</div>
					<h4>Faça seu pedido</h4>
				</div>
				<div v-if="order.orderItems.length > 0">
					<div v-for="orderItem in order.orderItems" v-bind:key="orderItem.item.id">
						<div class="row">
							<div class="col-md-2">
								{{ orderItem.quantity }}
							</div>
							<div class="col-md-6">
								{{ orderItem.item.description }}
							</div>
							<div class="col-md-4 text-right">
								{{ formatMoney(orderItem.quantity * orderItem.item.price) }}
							</div>
						</div>
					</div>
					<br/>
					<button class="btn btn-info btn-lg btn-block">Confirmar</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import "bootstrap/dist/css/bootstrap.css";
import "font-awesome/css/font-awesome.css";
import moment from "moment/src/moment";
import axios from "axios/dist/axios";

export default {
	name: "app",
	data() {
		return {
			filter: "",
			items: [],
			order: {
				id: Math.floor(Math.random() * 10000),
				date: moment().format("DD/MM/YYYY HH:mm"),
				orderItems: [],
				total: 0
			}
		};
	},
	methods: {
		formatMoney(value) {
			const formatter = new Intl.NumberFormat("pt-BR", {
				style: "currency",
				currency: "BRL"
			});
			return formatter.format(value);
		},
		addItem(item) {
			const orderItem = this.order.orderItems.find(orderItem => orderItem.item.id === item.id);
			if (!orderItem) {
				this.order.orderItems.push({
					quantity: 1,
					item
				});
			} else {
				orderItem.quantity++;
			}
			this.order.total += item.price;
		}
	},
	computed: {
		filteredItems() {
			if (!this.filter) return this.items;
			return this.items.filter(item => item.description.includes(this.filter));
		}
	},
	created() {
		axios({
			url: "http://localhost:4000",
			method: "post",
			data: {
				query: `
					{
						items {
							id
							category
							description
							price
						}
					}
				`
			}
		}).then(response => {
			const query = response.data;
			this.items = query.data.items;
		});
	}
};
</script>

<style>
hr {
	border-color: #999 !important;
}
.items {
	padding: 30px;
}
.order {
	background-color: #DDD;
	padding: 30px;
	height: 100vh;
}
.no-order-icon {
	padding: 60px;
}
</style>
