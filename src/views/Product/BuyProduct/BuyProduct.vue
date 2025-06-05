<template>
    <!-- 面包屑导航区 -->
    <el-breadcrumb>
        <el-breadcrumb-item :to="{ path: '/homePage' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>加入竞拍</el-breadcrumb-item>
    </el-breadcrumb>


    <div>
        <el-row :gutter="20" style="margin-top:10px;">

            <el-col :span="16">
                <div>
                    <el-card class="box-card">

                        <div>
                            <el-form label-width="80px" v-model="productForm" size="small" label-position="right">
                                <el-form-item label="商品id" prop="">
                                    <el-input auto-complete="off" v-model="productForm.productId"></el-input>
                                </el-form-item>


                            </el-form>
                            <div slot="footer" class="dialog-footer">
                                <el-button type="primary" @click="buyproduct">加入竞拍</el-button>
                            </div>
                        </div>
                    </el-card>
                </div>
            </el-col>

        </el-row>
    </div>
</template>

<script>

import { EnterAuction } from '@/utils/api/AuctionApi';
export default {
    data() {
        return {
            productForm: {
                productId: null,
            }
        };
    },
    methods: {
        buyproduct() {
            var that = this;
            EnterAuction(that.productForm.productId).then(function (resp) {
                switch (resp.data.status) {
                    case 0:
                        that.$message.success("您已成功加入竞拍")
                        break;
                    case 1:
                        that.$message.error("商品拍卖未开始");
                        break;
                    case 2:
                        that.$message.error("商品拍卖已结束");
                        break;
                    case 3:
                        that.$message.error("商品不存在");
                        break;
                    default:
                        that.$message.error(resp.data.msg || "未知错误，请稍后再试");
                        break;
                }
            });
        },
        backmyproduct() {
            this.$router.push('/myproduct')
        }
    }
}

</script>
<style>
.grid-content {
    border-radius: 4px;
    min-height: 36px;
}

.bg-purple {
    background: #d3dce6;
}

.box-card {
    width: 100%;
}

.dialog-footer {
    padding-top: 10px;
    padding-left: 10%;
}
</style>