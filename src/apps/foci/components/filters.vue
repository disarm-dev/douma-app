<template>
    <div class="filter-container">
      
      <div class="filter_name">
        <span>Status:</span>
      </div>

      <div>
        <md-input-container>
          <md-select>
            <md-option value="inactive">inactive</md-option>
            <md-option value="active">active</md-option>
            <md-option value="cleared">cleared</md-option>
          </md-select>
        </md-input-container>
      </div>

      <div class="filter_name">
        <span>Investigation Status:</span>
      </div>

      <div>
        <md-input-container>
          <md-select>
            <md-option value="investigated">investigated</md-option>
            <md-option value="suggested">suggested</md-option>
            <md-option value="visual_review">visual review</md-option>
          </md-select>
        </md-input-container>
      </div>

    </div>
</template>
<style>
  .filter-container {
    width: 100%;
    height: 64px;
    display: flex;
    align-items: center;
    align-self: flex-start;
  }
</style>
