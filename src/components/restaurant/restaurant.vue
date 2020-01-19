<template>
<div>
  <Header></Header>
  <!-- Page Content -->
  <div class="container">

    <!-- Jumbotron Header -->
    <header class="jumbotron my-4">
      <h2 class="display-3">A Warm Welcome!</h2>
      <p class="lead">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsa, ipsam, eligendi, in quo sunt possimus non incidunt odit vero aliquid similique quaerat nam nobis illo aspernatur vitae fugiat numquam repellat.</p>
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <input type="text" id="free_word" class="form-control mr-sm-2" v-model="keyword" placeholder="フリーワード" aria-label="フリーワード">

        <div class="collapse navbar-collapse" id="Navber">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item dropdown">
              <select class="nav-link dropdown-toggle" id="navbarDropdown1" v-model="largeAreaCd">
                <option value="">大エリア</option>
                <option v-for="largeArea in largeAreaList" :key="largeArea.code" :value="largeArea.code">{{ largeArea.name }}</option>
              </select>
            </li>
            <li class="nav-item dropdown">
              <select class="nav-link dropdown-toggle" id="navbarDropdown2" v-model="middleAreaCd">
                <option value="">中エリア</option>
                <option v-for="middleArea in middleAreaList" :key="middleArea.code" :value="middleArea.code">{{ middleArea.name }}</option>
              </select>
            </li>
            <li class="nav-item dropdown">
              <select class="nav-link dropdown-toggle" id="navbarDropdown3" v-model="smallAreaCd">
                <option value="">小エリア</option>
                <option v-for="smallArea in smallAreaList" :key="smallArea.code" :value="smallArea.code">{{ smallArea.name }}</option>
              </select>
            </li>
          </ul>
          <div class="form-inline my-2 my-lg-0">
            <button type="submit" class="btn btn-outline-success my-2 my-sm-0" @click="search">検索</button>
          </div>
        </div><!-- /.navbar-collapse -->
      </nav>
    </header>

    <!-- Page Features -->
    <div class="row text-center">

      <div class="col-lg-4 col-md-6 mb-4" v-for="restaurant in restaurantList" :key="restaurant.id">
        <div class="card h-100">
          <img class="card-img-top" :src="restaurant.logo_image" alt="">
          <div class="card-body">
            <h4 class="card-title">{{ restaurant.name }}</h4>
            <p class="card-text">{{ restaurant.catch }}</p>
          </div>
          <div class="card-footer">
            <a href="#" class="btn btn-primary">Find Out More!</a>
          </div>
        </div>
      </div>

    </div>
    <!-- /.row -->

  </div>
  <!-- /.container -->
  <Pagination :rows="resultsCount" @updated="execCurrentPage" />

</div>

</template>

<script>
import Header from './header'
import Pagination from './pagination'

export default {
  name: 'Restaurant',
  components: {
    Header,
    Pagination
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App (restaurant)',
      hotApiKey: 'ec6c51669c0592f9',
      keyword: '',
      largeAreaList: [],
      middleAreaList: [],
      smallAreaList: [],
      largeAreaCd: '',
      middleAreaCd: '',
      smallAreaCd: '',
      restaurantList: [],
      resultsCount: 0,
      currentPage: 1
    }
  },
  watch: {
    largeAreaCd () {
      if (this.largeAreaCd) {
        this.$axios.get(`http://webservice.recruit.co.jp/hotpepper/middle_area/v1/?key=${this.hotApiKey}&large_area=${this.largeAreaCd}&format=json`).then((res) => {
          this.middleAreaList = res.data.results.middle_area
        }).catch(err => {
          console.log(err)
        })
      }
    },
    middleAreaCd () {
      if (this.middleAreaCd) {
        this.$axios.get(`http://webservice.recruit.co.jp/hotpepper/small_area/v1/?key=${this.hotApiKey}&middle_area=${this.middleAreaCd}&format=json`).then((res) => {
          this.smallAreaList = res.data.results.small_area
        }).catch(err => {
          console.log(err)
        })
      }
    }
  },
  mounted () {
    this.$axios.get(`http://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=${this.hotApiKey}&large_area=Z011&count=20&format=json`).then((res) => {
      const results = res.data.results
      this.restaurantList = results.shop
      this.resultsCount = results.results_available
      console.log(results)
      console.log(this.restaurantList)
    }).catch(err => {
      console.log(err)
    })

    this.$axios.get(`http://webservice.recruit.co.jp/hotpepper/large_area/v1/?key=${this.hotApiKey}&format=json`).then((res) => {
      this.largeAreaList = res.data.results.large_area
    }).catch(err => {
      console.log(err)
    })
  },
  computed: {
    startNumber () {
      const num = 1 + (this.currentPage - 1) * this.perPages
      console.log(num)
      return num
    },
    perPages () {
      return 20
    }
  },
  methods: {
    searchQuery (param, value) {
      let query = ''
      if (value) {
        query = `&${param}=${value}`
      }
      return query
    },
    search () {
      this.$axios.get(`http://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=${this.hotApiKey}${this.searchQuery('keyword', this.keyword)}${this.searchQuery('large_area', this.largeAreaCd)}${this.searchQuery('middle_area', this.middleAreaCd)}${this.searchQuery('small_area', this.smallAreaCd)}${this.searchQuery('count', this.perPages)}${this.searchQuery('start', this.startNumber)}&format=json`).then((res) => {
        const results = res.data.results
        this.restaurantList = results.shop
        this.resultsCount = results.results_available
      }).catch(err => {
        console.log(err)
      })
    },
    execCurrentPage (value) {
      this.currentPage = value
      this.search()
      console.log(value)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
#free_word {
  width: 30%;
}
select.nav-link {
  height: 2.5rem;
  border: none;
}
</style>
