<template>
  <div class="wrapper">
    <Header title="职业健康" text="健康档案"></Header>
    <div class="table">
      <div class="table-top">
        <el-button type="primary" @click="newlist=true">新建</el-button>
        <div style="height: 40px;float: right">
          <el-form :inline="true">
            <el-form-item item="组织架构:">
              <el-select>
                <el-option label="1" value="一"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="关键字:">
              <el-input placeholder="请输入关键字" v-model="form.key" style="width: 120px"></el-input>
            </el-form-item>
            <el-form-item><el-button type="primary">查询</el-button></el-form-item>
          </el-form>
        </div>
      </div>
      <div class="table-main">
        <div class="detail">
          <el-table :data="Items" class="datalist" border  height="calc(100vh - 355px)">
            <el-table-column  label="姓名" prop="Code">
            </el-table-column>
            <el-table-column prop="Code" label="性别">
            </el-table-column>
            <el-table-column prop="StartTime" label="年龄">
            </el-table-column>
            <el-table-column prop="EndTime" label="名族">
            </el-table-column>
            <el-table-column prop="Person" label="遗传史">
            </el-table-column>
            <el-table-column prop="PrincipalEmployeeName" label="病史">
            </el-table-column>
            <el-table-column prop="PrincipalEmployeeName" label="手术史">
            </el-table-column>
            <el-table-column prop="PrincipalEmployeeName" label="操作">
              <el-link :underline="false" type="primary">详情</el-link>
              <el-link :underline="false" type="primary" @click="changedetail=true">修改</el-link>
              <el-link :underline="false" type="primary" @click="deletecontent">删除</el-link>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="table-foot">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[100, 200, 300, 400]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400">
      </el-pagination>
    </div>
    <el-dialog title="新建健康档案" :visible.sync="newlist" width="1100px" style="height: 100%;overflow: auto">
      <div style="background-color: white;overflow-y: auto;overflow-x: hidden;height: 350px">
        <el-form v-model="form" labelWidth="100px" :inline="true">
           <el-form-item label="组织架构">
              <el-select v-model="form.key" style="width: 180px">
                <el-option value="Yi" label="1"></el-option>
              </el-select>
           </el-form-item>
          <el-form-item label="姓名">
            <el-select v-model="form.key" style="width: 180px">
              <el-option value="Yi" label="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="出生年月">
            <el-date-picker style="width: 180px"></el-date-picker>
          </el-form-item>
          <el-form-item label="组织架构">
            <el-select v-model="form.key" style="width: 180px">
              <el-option value="Yi" label="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="组织架构">
            <el-select v-model="form.key" style="width: 180px">
              <el-option value="Yi" label="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="遗传史">
            <el-input type="textarea" :rows="4" style="width: 910px"></el-input>
          </el-form-item>
          <el-form-item label="疾病史">
            <el-input type="textarea" :rows="4" style="width: 910px"></el-input>
          </el-form-item>
          <el-form-item label="手术史">
            <el-input type="textarea" :rows="4" style="width: 910px"></el-input>
          </el-form-item>
          <el-form-item label="附件">
            <el-upload
              class="upload-demo"
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              multiple
              :limit="3"
              :on-exceed="handleExceed"
              :file-list="fileList">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button @click="newlist = false">取 消</el-button>
        <el-button type="primary" @click="newlist = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="新建健康档案" :visible.sync="changedetail" width="1100px" style="height: 100%;overflow: auto">
      <div style="background-color: white;overflow-y: auto;overflow-x: hidden;height: 350px">
        <el-form v-model="form" labelWidth="100px" :inline="true">
          <el-form-item label="组织架构">
            <el-select v-model="form.key" style="width: 180px">
              <el-option value="Yi" label="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="姓名">
            <el-select v-model="form.key" style="width: 180px">
              <el-option value="Yi" label="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="出生年月">
            <el-date-picker style="width: 180px"></el-date-picker>
          </el-form-item>
          <el-form-item label="组织架构">
            <el-select v-model="form.key" style="width: 180px">
              <el-option value="Yi" label="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="组织架构">
            <el-select v-model="form.key" style="width: 180px">
              <el-option value="Yi" label="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="遗传史">
            <el-input type="textarea" :rows="4" style="width: 910px"></el-input>
          </el-form-item>
          <el-form-item label="疾病史">
            <el-input type="textarea" :rows="4" style="width: 910px"></el-input>
          </el-form-item>
          <el-form-item label="手术史">
            <el-input type="textarea" :rows="4" style="width: 910px"></el-input>
          </el-form-item>
          <el-form-item label="附件">
            <el-upload
              class="upload-demo"
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              multiple
              :limit="3"
              :on-exceed="handleExceed"
              :file-list="fileList">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button @click="changedetail = false">取 消</el-button>
        <el-button type="primary" @click="changedetail = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  import Header from '../../components/assembly/Header.vue'
  export default {
    components: {
      Header
    },
    methods: {
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },
      deletecontent() {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
    },
    data () {
      return {
        form: {
          key: ''
        },
        value: '属性',
        changedetail:false,
        newlist: false,
        currentPage1: 5,
        currentPage2: 5,
        currentPage3: 5,
        currentPage4: 4,
        Items: [
          {
            'Code': 123,
            'Name': 123,
            'StartTime': 123,
            'EndTime': 123,
            'Rate': 123,
            'Person': 123,
            'PrincipalEmployeeName': 123,
            'StateName': 123,
            'detail': [
              {
                'type': 1,
                'name': 12,
                'item': 123,
                'rank': 1234
              }
            ]
          },
          {
            'Code': 123,
            'Name': 123,
            'StartTime': 123,
            'EndTime': 123,
            'Rate': 123,
            'Person': 123,
            'PrincipalEmployeeName': 123,
            'StateName': 123,
            'detail': [
              {
                'type': 1,
                'name': 12,
                'item': 123,
                'rank': 1234
              }
            ]
          },
          {
            'Code': 123,
            'Name': 123,
            'StartTime': 123,
            'EndTime': 123,
            'Rate': 123,
            'Person': 123,
            'PrincipalEmployeeName': 123,
            'StateName': 123,
            'detail': [
              {
                'type': 1,
                'name': 12,
                'item': 123,
                'rank': 1234
              }
            ]
          },
          {
            'Code': 123,
            'Name': 123,
            'StartTime': 123,
            'EndTime': 123,
            'Rate': 123,
            'Person': 123,
            'PrincipalEmployeeName': 123,
            'StateName': 123,
            'detail': [
              {
                'type': 1,
                'name': 12,
                'item': 123,
                'rank': 1234
              }
            ]
          },
          {
            'Code': 123,
            'Name': 123,
            'StartTime': 123,
            'EndTime': 123,
            'Rate': 123,
            'Person': 123,
            'PrincipalEmployeeName': 123,
            'StateName': 123,
            'detail': [
              {
                'type': 1,
                'name': 12,
                'item': 123,
                'rank': 1234
              }
            ]
          },
          {
            'Code': 123,
            'Name': 123,
            'StartTime': 123,
            'EndTime': 123,
            'Rate': 123,
            'Person': 123,
            'PrincipalEmployeeName': 123,
            'StateName': 123,
            'detail': [
              {
                'type': 1,
                'name': 12,
                'item': 123,
                'rank': 1234
              }
            ]
          },
          {
            'Code': 123,
            'Name': 123,
            'StartTime': 123,
            'EndTime': 123,
            'Rate': 123,
            'Person': 123,
            'PrincipalEmployeeName': 123,
            'StateName': 123,
            'detail': [
              {
                'type': 1,
                'name': 12,
                'item': 123,
                'rank': 1234
              }
            ]
          },
          {
            'Code': 123,
            'Name': 123,
            'StartTime': 123,
            'EndTime': 123,
            'Rate': 123,
            'Person': 123,
            'PrincipalEmployeeName': 123,
            'StateName': 123,
            'detail': [
              {
                'type': 1,
                'name': 12,
                'item': 123,
                'rank': 1234
              }
            ]
          }
        ],
        stopcontent: false,
        index: 1  //当前页面编号
      }
    }
  }
</script>

<style scoped>
  .wrapper{
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
  .wrapper .table{
    height: calc(100% - 150px);
    margin: 15px 25px 11px;
    overflow: hidden;
  }
  .wrapper .table .table-top{
    height: 40px;
    background-color: white;
    border-radius: 5px;
    padding: 10px 0 10px 20px;
    margin: 0 2px 5px 2px;
  }
  .wrapper  .table-foot{
    margin: 15px 25px 11px;
    height: 35px;
    line-height: 35px;
    background-color: white;
  }
  .wrapper  .table-foot .el-pagination{
    text-align: right !important;
  }
</style>
