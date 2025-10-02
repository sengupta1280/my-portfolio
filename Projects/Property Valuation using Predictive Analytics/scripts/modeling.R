setwd("C:/Users/Abhishek Sengupta/OneDrive - LA TROBE UNIVERSITY/Sem 2/BUS5PA/Assignment 1 Building and Evaluating Predictive Models in R-20230811")
housing_data<- read.csv("HousingValuationTest-V2.csv")

#1)b)i) Mean, median, max, min, standard deviation and skewness for each of the numerical variables 

num_col<-cbind('FullBath',	'HalfBath',	'BedroomAbvGr',	'KitchenAbvGr',	'TotalRmsAbvGrd',	'Fireplaces',	'SalePrice','LotArea',	'TotalBSF',	'LowQualFinSF',	'LivingArea',	'GarageCars',	'PoolArea',	'OpenPorchSF')

num_col<-housing_data[,num_col]


summary(num_col)

library(moments)

skewness(num_col)

apply(num_col,2,sd,simplify=TRUE)

library(Amelia)
colSums(is.na(num_col))

#1)b)ii) Frequency of categorical variables
empty_cell<- which(is.na(cat_col$GarageType))
cat_col[empty_cell,"GarageType"]<-"NA"
cat_col<-cbind('Id',	'LandContour',	'Utilities',	'LotConfig',	'DwellClass',	'GarageType',	'CentralAir',	'PavedDrive',	'LotShape',	'Slope',	'OverallQuality',	'OverallCondition',	'ExteriorCondition',	'BasementCondition',	'KitchenQuality',	'MoSold',	'YrSold','YearBuilt')
cat_col<- housing_data[,cat_col]


apply(cat_col,2,table) #frequency of each categorical variables

#2 a) Histogram for numerical variables

library(purrr)
library(tidyr)
library(ggplot2)
num_col %>%
  keep(is.numeric) %>% 
  gather() %>% 
  ggplot(aes(value)) +
  facet_wrap(~ key, scales = "free") +
  geom_histogram()

#2)b) Box plot for numerical variables

num_col %>%
  keep(is.numeric) %>% 
  gather() %>% 
  ggplot(aes(value)) +
  facet_wrap(~ key, scales = "free") +
  geom_boxplot()

#3)a) Variables with missing values

colSums(is.na(num_col)) #LivingArea, TotalBSF has missing values
colSums(is.na(cat_col)) #No missing values in Categorical variables

#3)c) -Adding Zero to missing values
num_col_zero<-num_col

is.na(num_col_zero)

num_col_zero[is.na(num_col_zero)]<- 0

colSums(is.na(num_col_zero))

#- Delete missing values
num_col_del<-num_col[complete.cases(num_col),]


#-add mean to missing values
num_col_mean<-num_col
colSums(is.na(num_col_mean))
num_col_mean$TotalBSF[is.na(num_col_mean$TotalBSF)]<-mean(num_col_mean$TotalBSF,na.rm = TRUE)
num_col_mean$LivingArea[is.na(num_col_mean$LivingArea)]<-mean(num_col_mean$LivingArea,na.rm = TRUE)


#comparing the summary of all the variables
summary(num_col$TotalBSF)
summary(num_col_zero$TotalBSF)
summary(num_col_del$TotalBSF)
summary(num_col_mean$TotalBSF)

skewness(num_col$TotalBSF)
skewness(num_col_zero$TotalBSF)
skewness(num_col_del$TotalBSF)
skewness(num_col_mean$TotalBSF)

sd(num_col$TotalBSF)
sd(num_col_zero$TotalBSF)
sd(num_col_del$TotalBSF)
sd(num_col_mean$TotalBSF)

summary(num_col$LivingArea)
summary(num_col_zero$LivingArea)
summary(num_col_del$LivingArea)
summary(num_col_mean$LivingArea)
skewness(num_col)

skewness(num_col$LivingArea)
skewness(num_col_zero$LivingArea)
skewness(num_col_del$LivingArea)
skewness(num_col_mean$LivingArea)

sd(num_col$LivingArea)
sd(num_col_zero$LivingArea)
sd(num_col_del$LivingArea)
sd(num_col_mean$TotalBSF)

#add NA in categorical variables empty columns
empty_cell<- which(is.na(housing_data$GarageType))
housing_data[empty_cell,"GarageType"]<-"NA"

#managing empty values in housing data by deleting NA values

#housing_data<-housing_data[,-c((ncol(housing_data)-1):ncol(housing_data))]
housing_data<-housing_data[complete.cases(housing_data),]


#3)e) 2 right skewed transformation- Sale Price, living area 

library(purrr)
library(tidyr)
library(ggplot2)
num_col_del %>%
  keep(is.numeric) %>% 
  gather() %>% 
  ggplot(aes(value)) +
  facet_wrap(~ key, scales = "free") +
  geom_histogram()

right_skew_col<- cbind('SalePrice','LivingArea')
right_skew_col<- housing_data[,right_skew_col]
constant=0.01
#Sale Price Transformation
skewness(right_skew_col$SalePrice)
skewness(log(right_skew_col$SalePrice)+constant)

par(mfrow=c(1,2))
boxplot(right_skew_col$SalePrice, main="Before Transformation",xlab="Sale Price")
boxplot((log(right_skew_col$SalePrice)+constant), main="After Transformation",xlab="Sale Price")

par(mfrow=c(1,2))
hist(right_skew_col$SalePrice, main="Before Transformation",xlab="Sale Price")
hist((log(right_skew_col$SalePrice)+constant), main="After Transformation",xlab="Sale Price")

#Living Area Above Ground transformation
skewness(right_skew_col$LivingArea)
skewness(log(right_skew_col$LivingArea)+constant)

par(mfrow=c(1,2))
boxplot(right_skew_col$LivingArea, main="Before Transformation",xlab="Living Area")
boxplot((log(right_skew_col$LivingArea)+constant), main="After Transformation",xlab="Living Area")

par(mfrow=c(1,2))
hist(right_skew_col$LivingArea, main="Before Transformation",xlab="Living Area")
hist((log(right_skew_col$LivingArea)+constant), main="After Transformation",xlab="Living Area")


#4.a. Transforming categorical variables
library(dplyr)
transform_data<-housing_data%>% mutate(LandContour=as.numeric(factor(LandContour)))%>%
mutate(Utilities=as.numeric(factor(Utilities)))%>% 
mutate(LotConfig=as.numeric(factor(LotConfig)))%>%
mutate(Slope=as.numeric(factor(Slope)))%>%
mutate(DwellClass=as.numeric(factor(DwellClass)))%>%
mutate(ExteriorCondition=as.numeric(factor(ExteriorCondition)))%>%
mutate(BasementCondition=as.numeric(factor(BasementCondition)))%>%
mutate(KitchenQuality=as.numeric(factor(KitchenQuality)))%>%
mutate(GarageType=as.numeric(factor(GarageType)))%>%
mutate(PavedDrive=as.numeric(factor(PavedDrive)))%>%
mutate(CentralAir=as.numeric(factor(CentralAir)))



#5.a. Correlations between variables
library(caret)
library(GGally)

target<-transform_data$SalePrice
target1<-transform_data$SalePrice
target2<-transform_data$SalePrice
target3<-transform_data$SalePrice
transform_data=subset(transform_data,select = -c(SalePrice))
ggcorr(housing_data,label=TRUE)

#b 
M <- data.matrix(transform_data)
corrM <- cor(M)


highlyCorrM <- findCorrelation(corrM, cutoff=0.5)
names(transform_data)[highlyCorrM]

#"LivingArea"     "OverallQuality" "YearBuilt"    "TotalRmsAbvGrd"

#removed TotalRmsAbvGrd as other factors can be considered like LivingArea, FullBath, HalfBath
housing_data_selected = subset(transform_data,select = -c(TotalRmsAbvGrd,Id))
housing_data_model1= subset(transform_data,select = -c(YearBuilt,Id))
housing_data_model2= subset(transform_data,select = -c(OverallQuality,Id))

ggcorr(housing_data_selected,label=TRUE)

#c
housing_data_selected$Saleprice<- target1
housing_data_model1$Saleprice<- target2
housing_data_model2$Saleprice<- target3
ggcorr(housing_data_selected,label=TRUE)

#Part C- Linear Model 1
#1.
#set sample configuration
smp_size <- floor(2/3 * nrow(housing_data_selected)) 
set.seed(2)

housing.train <- housing_data_selected[1:smp_size, ] 
housing.test <- housing_data_selected[(smp_size+1):nrow(housing_data_selected),]

#building predictive model
library(stats)
formula = Saleprice~.

model <- lm(formula = formula, data = housing.train)
# Display the coefficients of the linear regression model
summary(model)$coefficients

#applying regression formula
as.formula(
  paste0("y ~ ", round(coefficients(model)[1],2), " + ", 
         paste(sprintf("%.2f * %s",coefficients(model)[-1], 
                       names(coefficients(model)[-1])), 
               collapse=" + ")
  )
)

#predicted probabilities

housing.train$predicted.Saleprice <- predict(model, housing.train) #use type="class" for logarithmic regression
housing.test$predicted.Saleprice <- predict(model, housing.test)
print("Actual Values")
head(housing.test$Saleprice[1:5])
print("Predicted Values")
head(housing.test$predicted.SalePrice[1:5])

library(plotly)
plot1 <-housing.test %>%
  ggplot(aes(Saleprice,predicted.Saleprice)) +
  geom_point(alpha=0.5) +
  stat_smooth(aes(colour='red')) +
  xlab('Actual value of mvalue') +
  ylab('Predicted value of mvalue')+
  theme_bw()
ggplotly(plot1)

#Linear model 2
#1.
#set sample configuration
smp_size1 <- floor(2/3 * nrow(housing_data_model1)) 
set.seed(2)

housing_model1.train <- housing_data_model1[1:smp_size1, ] 
housing_model1.test <- housing_data_model1[(smp_size1+1):nrow(housing_data_model1),]

#building predictive model
library(stats)
formula1 = Saleprice~.

model <- lm(formula = formula1, data = housing_model1.train)
# Display the coefficients of the linear regression model
summary(model)$coefficients

#applying regression formula
as.formula(
  paste0("y ~ ", round(coefficients(model)[1],2), " + ", 
         paste(sprintf("%.2f * %s",coefficients(model)[-1], 
                       names(coefficients(model)[-1])), 
               collapse=" + ")
  )
)

#predicted probabilities

housing_model1.train$predicted.Saleprice <- predict(model, housing_model1.train) #use type="class" for logarithmic regression
housing_model1.test$predicted.Saleprice <- predict(model, housing_model1.test)
print("Actual Values")
head(housing_model1.test$Saleprice[1:5])
print("Predicted Values")
head(housing_model1.test$predicted.SalePrice[1:5])

library(plotly)
plot2 <-housing_model1.test %>%
  ggplot(aes(Saleprice,predicted.Saleprice)) +
  geom_point(alpha=0.5) +
  stat_smooth(aes(colour='red')) +
  xlab('Actual value of mvalue') +
  ylab('Predicted value of mvalue')+
  theme_bw()
ggplotly(plot2)

#Linear model 3
#1.
#set sample configuration
smp_size <- floor(2/3 * nrow(housing_data_model2)) 
set.seed(2)

housing_model2.train <- housing_data_model2[1:smp_size, ] 
housing_model2.test <- housing_data_model2[(smp_size+1):nrow(housing_data_model2),]

#building predictive model
library(stats)
formula2 = Saleprice~.

model <- lm(formula = formula2, data = housing_model2.train)
# Display the coefficients of the linear regression model
summary(model)$coefficients

#applying regression formula
as.formula(
  paste0("y ~ ", round(coefficients(model)[1],2), " + ", 
         paste(sprintf("%.2f * %s",coefficients(model)[-1], 
                       names(coefficients(model)[-1])), 
               collapse=" + ")
  )
)

#predicted probabilities

housing_model2.train$predicted.Saleprice <- predict(model, housing_model2.train) #use type="class" for logarithmic regression
housing_model2.test$predicted.Saleprice <- predict(model, housing_model2.test)
print("Actual Values")
head(housing_model2.test$Saleprice[1:5])
print("Predicted Values")
head(housing_model2.test$predicted.SalePrice[1:5])

library(plotly)
plot3 <-housing_model2.test %>%
  ggplot(aes(Saleprice,predicted.Saleprice)) +
  geom_point(alpha=0.5) +
  stat_smooth(aes(colour='red')) +
  xlab('Actual value of mvalue') +
  ylab('Predicted value of mvalue')+
  theme_bw()
ggplotly(plot3)

#calculating rmse

error1 <- housing.test$Saleprice-housing.test$predicted.Saleprice
rmse1 <- sqrt(mean(error1^2))
print(paste("Root Mean Square Error: ", rmse1))

error2 <- housing_model1.test$Saleprice-housing_model1.test$predicted.Saleprice
rmse2 <- sqrt(mean(error2^2))
print(paste("Root Mean Square Error: ", rmse2))

error3 <- housing_model2.test$Saleprice-housing_model2.test$predicted.Saleprice
rmse3 <- sqrt(mean(error3^2))
print(paste("Root Mean Square Error: ", rmse3))


# Decsion Tree with all variables
library(rpart)
housing.train <- transform_data[1:smp_size, ] 
housing.test <- transform_data[(smp_size+1):nrow(transform_data),]
tree_model1 <- rpart(Saleprice~., data = housing.train)
summary(tree_model1)


library(rpart.plot)
rpart.plot(tree_model1)
test_predictions <- predict(tree_model1, newdata = housing.test)
residuals <- housing.test$SalePrice - test_predictions
rmse <- sqrt(mean(residuals^2))
rmse


# Second tree model with pruning

tree_model2 <- rpart(Saleprice ~ ., data = housing.train, control = rpart.control(cp = 0.02))  # Adjust the cp value as needed
rpart.plot(tree_model2)
test_predictions <- predict(tree_model2, newdata = housing.test)
residuals <- housing.train$Saleprice - test_predictions
rmse <- sqrt(mean(residuals^2))
rmse


# Third tree model with pruning

# Fit the decision tree model with pruning
tree_model3 <- rpart(Saleprice ~ ., data = housing.train, control = rpart.control(cp = 0.04))  # Adjust the cp value as needed
rpart.plot(tree_model3)
test_predictions <- predict(tree_model3, newdata = housing.train)
residuals <- housing.train$Saleprice - test_predictions
rmse <- sqrt(mean(residuals^2))
rmse

