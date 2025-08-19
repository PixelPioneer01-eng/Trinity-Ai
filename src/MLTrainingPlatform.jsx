import React, { useState } from "react";
import axios from "axios";
import './globals.css';
import './config.css';
import {
  Tabs,
  Button,
  Upload,
  Table,
  Form,
  Input,
  InputNumber,
  Space,
  Card,
  Typography,
  message,
} from "antd";
import {
  UploadOutlined,
  CloudUploadOutlined,
  SettingOutlined,
  ReloadOutlined,
  ExperimentOutlined,
  BarChartOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
const { TabPane } = Tabs;
const { Title, Text } = Typography;

const MLTrainingPlatform = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  const [uploadData, setUploadData] = useState([]);
  const [testData, setTestData] = useState([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [file1, setFile1] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [shapImage, setShapImage] = useState(null);
  const [limeImage, setlimeImage] = useState(null);

  const uploadColumns = [
    {
      title: "Additional Family Income ($)",
      dataIndex: "Additional Family Income($)",
      key: "Additional Family Income($)",
    },
    { title: "Address Owned", dataIndex: "Address Owned", key: "addressOwned" },
    {
      title: "Address Verified",
      dataIndex: "Address Verified",
      key: "Address Verified",
    },
    {
      title: "Age of Bank Account (Years)",
      dataIndex: "Age of Bank Account(in Years)",
      key: "ageOfBankAccount",
    },
    { title: "Bank Name", dataIndex: "Bank Name", key: "bankName" },
    {
      title: "Collateral Provided",
      dataIndex: "Collateral Provided",
      key: "collateralProvided",
    },
    {
      title: "Credit Score ($)",
      dataIndex: "Credit Score($)",
      key: "creditScore",
    },
    {
      title: "Employment Status",
      dataIndex: "Employment Status",
      key: "employmentStatus",
    },
    {
      title: "Employment Verified",
      dataIndex: "Employment Verified",
      key: "employmentVerified",
    },
    { title: "Home Phone", dataIndex: "Home Phone", key: "homePhone" },
    {
      title: "Income Source Verified",
      dataIndex: "Income Source Verified",
      key: "incomeSourceVerified",
    },
    {
      title: "Monthly Debt ($)",
      dataIndex: "Monthly Debt($)",
      key: "monthlyDebt",
    },
    {
      title: "Monthly Income ($)",
      dataIndex: "Monthly Income($)",
      key: "monthlyIncome",
    },
    {
      title: "Mortgage Balance Outstanding ($)",
      dataIndex: "Mortgage Balance Outstanding($)",
      key: "mortgageBalanceOutstanding",
    },
    {
      title: "No. of Children",
      dataIndex: "No. of Children",
      key: "numChildren",
    },
    {
      title: "No. of Other Dependents",
      dataIndex: "No. of Other Dependents",
      key: "numOtherDependents",
    },
    { title: "Prediction", dataIndex: "Prediction", key: "prediction" },
    {
      title: "Probability of Default",
      dataIndex: "Probability_of_Default",
      key: "probabilityOfDefault",
      render: (value) => `${(value * 100).toFixed(2)}%`,
    },
    {
      title: "Reference Credit Score ($)",
      dataIndex: "Reference Credit Score($)",
      key: "referenceCreditScore",
    },
    {
      title: "Reference Provided",
      dataIndex: "Reference Provided",
      key: "referenceProvided",
    },
    {
      title: "Reputed Employer",
      dataIndex: "Reputed Employer",
      key: "reputedEmployer",
    },
    {
      title: "Residential Status",
      dataIndex: "Residential status",
      key: "residentialStatus",
    },
    {
      title: "Social Graph Score",
      dataIndex: "Social Graph Score",
      key: "socialGraphScore",
    },
    {
      title: "Spouse's Income ($)",
      dataIndex: "Spouse's Income($)",
      key: "spouseIncome",
    },
    {
      title: "Value of Home ($)",
      dataIndex: "Value of Home($)",
      key: "valueOfHome",
    },
    { title: "YOB", dataIndex: "YOB", key: "yob" },
    {
      title: "Yearly Income ($)",
      dataIndex: "Yearly Income($)",
      key: "yearlyIncome",
    },
  ];

  const props = {
    beforeUpload: (file) => {
      if (file.type !== "text/csv") {
        message.error("Please select a CSV file.");
        return Upload.LIST_IGNORE;
      }
      setFile(file);
      return false;
    },
    onRemove: () => {
      setFile(null);
    },
    maxCount: 1,
  };

  const testUploadProps = {
    beforeUpload: (file1) => {
      if (file1.type !== "text/csv") {
        message.error("Please select a CSV file.");
        return Upload.LIST_IGNORE;
      }
      setFile1(file1);
      return false;
    },
    onRemove: () => {
      setFile1(null);
    },
    maxCount: 1,
  };

  const handleUpload = async () => {
    if (!file) {
      message.error("Please select a CSV file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    try {
      const response = await axios.post(
        "https://platform.thetrinityaisoftware.com/new_xgb/upload-train",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUploadData(response?.data);
      message.success("File uploaded successfully");

    } catch (error) {
      message.error("File upload failed");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };



  const handleDownload = async () => {
    try {
      setIsDownloading(true);

      const response = await fetch(
        "https://platform.thetrinityaisoftware.com/xgboostnew//download-predictions?timestamp=1755510186144"
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const contentDisposition = response.headers.get("Content-Disposition");


      let filename = "predictions.csv";
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(
          /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
        );
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, "");
        }
      }


      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();


      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);


    } catch (error) {
      console.error("Download failed:", error);
      toast({
        title: "Download Failed",
        description: "Failed to download the file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const handleUploadTestdata = async () => {
    if (!file1) {
      message.error("Please select a CSV file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file1);

    setUploading(true);
    try {
      const response = await axios.post(
        "https://platform.thetrinityaisoftware.com/xgboostnew//upload-test",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setTestData(response?.data);
      message.success("File uploaded successfully");

    } catch (error) {
      message.error("File upload failed");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleFineTuneSubmit = async (values) => {
    setLoading(true);
    const formdata = new FormData();

    const params = {
      n_estimators: values.n_estimators || 150,
      max_depth: values.max_depth || 7,
      learning_rate: values.learning_rate || 0.1,
      subsample: values.subsample || 0.85,
      scale_pos_weight: values.scale_pos_weight || 5.0,
      max_leaves: values.max_leaves || 0,
      colsample_bytree: values.colsample_bytree || 0.7,
      colsample_bylevel: values.colsample_bylevel || 0.8,
      colsample_bynode: values.colsample_bynode || 0.9,
      gamma: values.gamma || 0.1,
      min_child_weight: values.min_child_weight || 2,
      reg_alpha: values.reg_alpha || 0.1,
      reg_lambda: values.reg_lambda || 1.0,
      max_delta_step: values.max_delta_step || 0,
      tree_method: values.tree_method || "hist",
      random_state: values.random_state || 42,
      eval_metric: values.eval_metric || "logloss",
      booster: values.booster || "gbtree",
      grow_policy: values.grow_policy || "depthwise",
      monotone_constraints: null,
      smote_k_neighbors: 5,
      smote_sampling_strategy: "auto",
      imputer_strategy: "median",
    };

    formdata.append("params", JSON.stringify(params));

    try {
      const response = await axios.post(
        " https://platform.thetrinityaisoftware.com/xgboostnew//train-model",
        formdata,

        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      message.success("Parameters set successfully!");

      form.resetFields();
    } catch (error) {
      message.error("Failed to set parameters");

    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    message.info("All fields reset");
  };

  const handleNextTab = () => {
    const nextTab = (parseInt(activeTab) + 1).toString();
    if (parseInt(nextTab) <= 4) {
      setActiveTab(nextTab);
    }
  };

  const explainShap = async () => {
    try {

      const response = await axios.post(
        "https://platform.thetrinityaisoftware.com/xgboostnew/explain-shap"
      );



      const timestamp = new Date().getTime();
      const imageUrl = `https://platform.thetrinityaisoftware.com/xgboostnew/download-shap?timestamp=${timestamp}`;


      return imageUrl;
    } catch (error) {
      console.error("Error explaining SHAP:", error);
      throw error;
    }
  };

  const handleExplainShap = async () => {
    try {
      const imgUrl = await explainShap();
      setShapImage(imgUrl);
    } catch (error) {
      alert("Failed to generate SHAP plot");
    }
  };

  const explainlime = async () => {
    try {
      const response = await axios.post(
        "https://platform.thetrinityaisoftware.com/xgboostnew/explain-lime"
      );



      const timestamp = new Date().getTime();
      const imageUrl1 = `https://platform.thetrinityaisoftware.com/xgboostnew/download-lime?timestamp=${timestamp}`;

      return imageUrl1;
    } catch (error) {
      console.error("Error explaining LIME:", error);
      throw error;
    }
  };

  const handleExplainLime = async () => {
    try {
      const imgUrl1 = await explainlime();
      setlimeImage(imgUrl1);
    } catch (error) {
      alert("Failed to generate LIME plot");
    }
  };

  const handleDownloadimages = async (url, fileName) => {
    try {
      const res = await axios.get(url, {
        responseType: "blob",
      });

      const blob = new Blob([res.data]);
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
      message.success(`${fileName} downloaded`);
    } catch (err) {
      message.error("Download failed");
    }
  };
  return (
    <div className="min-h-screen bg-gradient-subtle p-6">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-8">
          <Title
            level={1}
            className="!text-4xl !font-bold bg-gradient-hero bg-clip-text text-transparent"
          >
            Trinity AI ML Training Platform
          </Title>
          <Text className="text-lg text-muted-foreground">
            Train, fine-tune, and explain your machine learning models
          </Text>
        </div>


        <Card className="shadow-elegant border-0 bg-card/80 backdrop-blur-sm transition-all duration-300">
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            className="[&_.ant-tabs-tab]:font-semibold [&_.ant-tabs-tab-active]:text-ml-primary [&_.ant-tabs-ink-bar]:!bg-ml-primary"
            size="large"
          >

            <TabPane
              tab={
                <Space>
                  <CloudUploadOutlined />
                  Upload Train Data
                </Space>
              }
              key="1"
            >
              <div className="space-y-6">
                <div className="text-center py-8">
                  <Upload.Dragger
                    {...props}
                    className="!border-2 !border-dashed !border-ml-primary/30 !bg-ml-secondary/10 hover:!border-ml-primary transition-colors duration-200"
                  >
                    <p className="ant-upload-drag-icon">
                      <UploadOutlined className="text-4xl text-ml-primary" />
                    </p>
                    <p className="ant-upload-text text-lg font-semibold text-card-foreground">
                      Click or drag CSV file to upload training data
                    </p>
                    <p className="ant-upload-hint text-muted-foreground">
                      Support for single CSV file upload. Maximum file size:
                      100MB
                    </p>
                  </Upload.Dragger>
                  <Button
                    type="primary"
                    icon={<CloudUploadOutlined />}
                    onClick={handleUpload}
                    loading={uploading}
                    disabled={!file}
                    style={{ marginTop: 16 }}
                  >
                    Upload
                  </Button>
                </div>

                {uploadData?.top_10_records?.length > 0 && (
                  <Card bordered={false} className="shadow-card" style={{ borderRadius: 20 }}>
                    <Title level={4} className="!mb-4">
                      Data Preview
                    </Title>
                    <Table
                      columns={uploadColumns}
                      dataSource={uploadData?.top_10_records}
                      pagination={{ pageSize: 5 }}
                      loading={loading}
                      className="shadow-card"
                      scroll={{ x: "max-content" }}
                    />
                  </Card>
                )}

                <div className="flex justify-end">
                  <Button
                    type="primary"
                    size="large"
                    onClick={handleNextTab}
                    disabled={uploadData.length === 0}
                    className="bg-gradient-primary border-0 shadow-elegant px-8"
                  >
                    Next: Fine Tune Parameters
                  </Button>
                </div>
              </div>
            </TabPane>


            <TabPane
              tab={
                <Space>
                  <SettingOutlined />
                  Fine Tune Parameters
                </Space>
              }
              key="2"
            >
              <div className="form-container">
                <Title level={4}>Model Configuration</Title>

                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleFineTuneSubmit}
                  className="form-grid"
                >
                  <Form.Item
                    label="n_estimators"
                    name="n_estimators"
                    rules={[{ required: true }]}
                  >
                    <InputNumber min={1} placeholder="150" className="w-full" />
                  </Form.Item>

                  <Form.Item
                    label="max_depth"
                    name="max_depth"
                    rules={[{ required: true }]}
                  >
                    <InputNumber min={1} placeholder="7" className="w-full" />
                  </Form.Item>

                  <Form.Item
                    label="learning_rate"
                    name="learning_rate"
                    rules={[{ required: true }]}
                  >
                    <InputNumber
                      min={0.0001}
                      max={1}
                      step={0.0001}
                      placeholder="0.1"
                      className="w-full"
                    />
                  </Form.Item>

                  <Form.Item
                    label="subsample"
                    name="subsample"
                    rules={[{ required: true }]}
                  >
                    <InputNumber
                      min={0.1}
                      max={1}
                      step={0.01}
                      placeholder="0.85"
                      className="w-full"
                    />
                  </Form.Item>

                  <Form.Item
                    label="scale_pos_weight"
                    name="scale_pos_weight"
                    rules={[{ required: true }]}
                  >
                    <InputNumber
                      min={0}
                      step={0.1}
                      placeholder="5.0"
                      className="w-full"
                    />
                  </Form.Item>

                  <Form.Item
                    label="max_leaves"
                    name="max_leaves"
                    rules={[{ required: true }]}
                  >
                    <InputNumber min={0} placeholder="0" className="w-full" />
                  </Form.Item>

                  <Form.Item
                    label="colsample_bytree"
                    name="colsample_bytree"
                    rules={[{ required: true }]}
                  >
                    <InputNumber
                      min={0.1}
                      max={1}
                      step={0.01}
                      placeholder="0.7"
                      className="w-full"
                    />
                  </Form.Item>

                  <Form.Item
                    label="colsample_bylevel"
                    name="colsample_bylevel"
                    rules={[{ required: true }]}
                  >
                    <InputNumber
                      min={0.1}
                      max={1}
                      step={0.01}
                      placeholder="0.8"
                      className="w-full"
                    />
                  </Form.Item>

                  <Form.Item
                    label="colsample_bynode"
                    name="colsample_bynode"
                    rules={[{ required: true }]}
                  >
                    <InputNumber
                      min={0.1}
                      max={1}
                      step={0.01}
                      placeholder="0.9"
                      className="w-full"
                    />
                  </Form.Item>

                  <Form.Item
                    label="gamma"
                    name="gamma"
                    rules={[{ required: true }]}
                  >
                    <InputNumber
                      min={0}
                      step={0.01}
                      placeholder="0.1"
                      className="w-full"
                    />
                  </Form.Item>

                  <Form.Item
                    label="min_child_weight"
                    name="min_child_weight"
                    rules={[{ required: true }]}
                  >
                    <InputNumber
                      min={0}
                      step={1}
                      placeholder="2"
                      className="w-full"
                    />
                  </Form.Item>

                  <Form.Item
                    label="reg_alpha"
                    name="reg_alpha"
                    rules={[{ required: true }]}
                  >
                    <InputNumber
                      min={0}
                      step={0.01}
                      placeholder="0.1"
                      className="w-full"
                    />
                  </Form.Item>

                  <Form.Item
                    label="reg_lambda"
                    name="reg_lambda"
                    rules={[{ required: true }]}
                  >
                    <InputNumber
                      min={0}
                      step={0.01}
                      placeholder="1.0"
                      className="w-full"
                    />
                  </Form.Item>

                  <Form.Item
                    label="max_delta_step"
                    name="max_delta_step"
                    rules={[{ required: true }]}
                  >
                    <InputNumber placeholder="0" className="w-full" />
                  </Form.Item>

                  <Form.Item
                    label="tree_method"
                    name="tree_method"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="hist" className="h-8" />
                  </Form.Item>

                  <Form.Item
                    label="random_state"
                    name="random_state"
                    rules={[{ required: true }]}
                  >
                    <InputNumber min={0} placeholder="42" className="w-full" />
                  </Form.Item>

                  <Form.Item
                    label="eval_metric"
                    name="eval_metric"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="logloss" className="h-8" />
                  </Form.Item>

                  <Form.Item
                    label="booster"
                    name="booster"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="gbtree" className="h-8" />
                  </Form.Item>

                  <Form.Item
                    label="grow_policy"
                    name="grow_policy"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="depthwise" className="h-8" />
                  </Form.Item>

                  <Form.Item
                    label="monotone_constraints"
                    name="monotone_constraints"
                  >
                    <Input placeholder="null" className="h-8" />
                  </Form.Item>
                  <Form.Item
                    label="smote_k_neighbors"
                    name="smote_k_neighbors"
                  >
                    <Input placeholder="5" className="h-8" />

                  </Form.Item>

                  <Form.Item
                    label="imputer_strategy"
                    name="imputer_strategy"
                  >
                    <Input placeholder="median" className="h-8" />
                  </Form.Item>
                </Form>

                <div className="flex justify-between">
                  <Space>
                    <Button
                      onClick={handleReset}
                      icon={<ReloadOutlined />}
                      size="large"
                      className="px-6"
                    >
                      Reset All
                    </Button>
                    <Button
                      type="primary"
                      onClick={() => form.submit()}
                      loading={loading}
                      icon={<SettingOutlined />}
                      size="large"
                      className="bg-ml-accent border-0 px-6"
                    >
                      Set Parameters
                    </Button>
                  </Space>

                  <Button
                    type="primary"
                    size="large"
                    onClick={handleNextTab}
                    className="bg-gradient-primary border-0 shadow-elegant px-8"
                  >
                    Next: Upload Test Data
                  </Button>
                </div>
              </div>
            </TabPane>


            <TabPane
              tab={
                <Space>
                  <ExperimentOutlined />
                  Upload Test Data
                </Space>
              }
              key="3"
            >
              <div className="space-y-6">
                <div className="text-center py-8">
                  <Upload.Dragger
                    {...testUploadProps}
                    className="!border-2 !border-dashed !border-ml-accent/30 !bg-ml-accent/10 hover:!border-ml-accent transition-colors duration-200"
                  >
                    <p className="ant-upload-drag-icon">
                      <UploadOutlined className="text-4xl text-ml-accent" />
                    </p>
                    <p className="ant-upload-text text-lg font-semibold text-card-foreground">
                      Click or drag CSV file to upload test data
                    </p>
                    <p className="ant-upload-hint text-muted-foreground">
                      Upload test dataset for model evaluation
                    </p>
                  </Upload.Dragger>
                  <Button
                    type="primary"
                    icon={<CloudUploadOutlined />}
                    onClick={handleUploadTestdata}
                    loading={uploading}
                    disabled={!file1}
                    style={{ marginTop: 16 }}
                  >
                    Upload
                  </Button>
                </div>

                {testData?.top_10_with_predictions?.length > 0 && (
                  <Card bordered={false} className="shadow-card" style={{ borderRadius: 20 }}>
                    <Title level={4} className="!mb-4">
                      Test Data Preview
                    </Title>
                    <Table
                      columns={uploadColumns}
                      dataSource={testData?.top_10_with_predictions}
                      pagination={{ pageSize: 5 }}
                      loading={loading}
                      className="shadow-card"
                      scroll={{ x: "max-content" }}
                    />
                    <Button
                      type="primary"
                      icon={<DownloadOutlined />}
                      onClick={handleDownload}
                      style={{ marginTop: '16px' }}
                    >
                      Download Predictions
                    </Button>


                  </Card>
                )}


                <Button
                  type="primary"
                  size="large"
                  onClick={handleNextTab}
                  disabled={testData.length === 0}
                  className=" flex justify-endbg-gradient-primary border-0 shadow-elegant px-8 "
                  style={{ marginLeft: "65em", }}
                >
                  Next: Explain Model
                </Button>
              </div>
            </TabPane>


            <TabPane
              tab={
                <Space>
                  <BarChartOutlined />
                  Explain Model
                </Space>
              }
              key="4"
            >
              <div className="space-y-6">
                <div className="text-center">
                  <Title level={4}>Model Explanation & Analysis</Title>
                  <Text className="text-muted-foreground">
                    Choose an explanation method to understand your model's
                    predictions
                  </Text>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <Card
                    className="text-center hover:shadow-glow transition-all duration-300 border-ml-primary/20"
                    hoverable
                  >
                    <div className="p-6">
                      <BarChartOutlined className="text-5xl text-ml-primary mb-4" />
                      <Title level={5}>SHAP Analysis</Title>
                      <Text className="text-muted-foreground mb-6 block">
                        SHapley Additive exPlanations for feature importance
                      </Text>
                      <div>
                        <Button
                          type="primary"
                          size="large"
                          loading={loading}
                          onClick={() => handleExplainShap()}
                          className="bg-ml-accent border-0 w-full"
                        >
                          {loading ? "Generating SHAP..." : "Explain SHAP"}
                        </Button>
                      </div>
                    </div>
                  </Card>

                  <Card
                    className="text-center hover:shadow-glow transition-all duration-300 border-ml-accent/20"
                    hoverable
                  >
                    <div className="p-6">
                      <ExperimentOutlined className="text-5xl text-ml-accent mb-4" />
                      <Title level={5}>LIME Analysis</Title>
                      <Text className="text-muted-foreground mb-6 block">
                        Local Interpretable Model-agnostic Explanations
                      </Text>
                      <Button
                        type="primary"
                        size="large"
                        loading={loading}
                        onClick={() => handleExplainLime()}
                        className="bg-ml-accent border-0 w-full"
                      >
                        Run LIME
                      </Button>
                    </div>
                  </Card>

                  <div className="flex gap-4">
                    <div >
                      {shapImage && (
                        <div style={{ marginTop: "20px" }}>
                          <img
                            src={shapImage}
                            alt="SHAP Explanation"
                            style={{
                              maxWidth: "600px",
                              maxHeight: "500px",
                              border: "1px solid #ccc",
                            }}
                          />
                          <Button
                            type="primary"
                            size="large"
                            style={{ marginTop: 10 }}
                            icon={<DownloadOutlined />}
                            onClick={() =>
                              handleDownloadimages(
                                `https://platform.thetrinityaisoftware.com/xgboostnew//download-shap?timestamp=${new Date().getTime()}`,
                                "shap_explanation.png"
                              )
                            }
                          >
                            Download shap{" "}
                          </Button>
                        </div>
                      )}
                    </div>
                    <div>
                      {limeImage && (
                        <div style={{ marginTop: "20px" }}>
                          <img
                            src={limeImage}
                            alt="SHAP Explanation"
                            style={{
                              maxWidth: "600px",
                              maxHeight: "600px",
                              border: "1px solid #ccc",

                            }}
                          />
                          <Button
                            type="primary"
                            size="large"
                            style={{ marginTop: 24 }}
                            icon={<DownloadOutlined />}
                            onClick={() =>
                              handleDownloadimages(
                                `https://platform.thetrinityaisoftware.com/xgboostnew//download-lime?timestamp=${new Date().getTime()}`,
                                "lime_explanation.png"
                              )
                            }
                          >
                            Download Lime
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </TabPane>
          </Tabs>
        </Card>
      </div >
    </div >
  );
};

export default MLTrainingPlatform;
